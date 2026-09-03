#!/usr/bin/env python3
"""
Bootstrap do projeto Sales Copilot — Sprint 1

Cria a estrutura inicial do repositório para o Copiloto de Engenharia de Vendas:
- Backend Cloudflare Worker
- Motor de estado SPIN
- Modelos de contexto
- Contratos JSON
- Supabase SQL
- Prompts
- Testes
- Seed
- Docker
- Documentação

Uso:
    python bootstrap.py
    python bootstrap.py --root sales-copilot
"""

from pathlib import Path
import argparse

FILES = {
    "README.md": """# Sales Copilot — Sprint 1

Copiloto de Engenharia de Vendas para orientar vendedores em conversas em tempo real.

## Objetivo da Sprint 1

Construir a fundação do sistema:

1. Contexto estruturado da venda
2. Máquina de estados SPIN
3. Extração de sinais da conversa
4. Identificação de problemas e CTQs
5. Motor de próxima melhor pergunta
6. Contratos JSON para comunicação com IA
7. Banco Supabase/PostgreSQL
8. Endpoint inicial de sessão e transcrição
9. Testes automatizados
10. Seed de dados para desenvolvimento

## Arquitetura

```text
seller
   |
   v
frontend / realtime
   |
   v
Cloudflare Worker
   |
   +--> Transcript Processor
   |
   +--> SPIN State Machine
   |
   +--> CTQ Extractor
   |
   +--> Next Best Question Engine
   |
   +--> LLM Adapter
   |
   v
Supabase / PostgreSQL
```

## Princípio

> O LLM interpreta. As regras controlam. O banco registra. O vendedor decide.

## Estrutura

- `apps/worker` — backend
- `src/domain` — regras de negócio
- `src/application` — casos de uso
- `src/infrastructure` — integrações
- `contracts` — schemas JSON
- `prompts` — prompts versionados
- `supabase` — banco e seed
- `tests` — testes
- `docs` — documentação
- `scripts` — automações

## Próximo passo

Após criar o repositório, configurar:

- GitHub
- Supabase
- Cloudflare
- variáveis de ambiente
- OpenAI API

""",

    ".gitignore": """node_modules/
.wrangler/
.dev.vars
.env
.env.*
!.env.example
dist/
coverage/
.DS_Store
*.log
.vscode/
.idea/
__pycache__/
.pytest_cache/
""",

    ".env.example": """SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
ENVIRONMENT=development
""",

    "LICENSE": """MIT License

Copyright (c) 2026 Poder Computacional

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
""",

    "apps/worker/package.json": """{
  "name": "sales-copilot-worker",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20260901.0",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4",
    "wrangler": "^4.34.0"
  }
}
""",

    "apps/worker/tsconfig.json": """{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "types": ["@cloudflare/workers-types"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
""",

    "apps/worker/wrangler.toml": """name = "sales-copilot-worker"
main = "src/index.ts"
compatibility_date = "2026-09-01"

[vars]
ENVIRONMENT = "development"
""",

    "apps/worker/src/index.ts": """import { createSession } from "./application/createSession";
import { processTranscript } from "./application/processTranscript";

export interface Env {
  ENVIRONMENT: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "sales-copilot", sprint: "1" });
    }

    if (request.method === "POST" && url.pathname === "/sessions") {
      const body = await request.json().catch(() => ({}));
      return json(createSession(body));
    }

    if (request.method === "POST" && url.pathname === "/transcript") {
      const body = await request.json().catch(() => ({}));
      return json(processTranscript(body));
    }

    return json({ error: "Not Found" }, 404);
  }
};
""",

    "apps/worker/src/domain/spin.ts": """export type SpinStage =
  | "SITUATION"
  | "PROBLEM"
  | "IMPLICATION"
  | "NEED_PAYOFF"
  | "CTQ"
  | "BUSINESS_CASE"
  | "OFFER"
  | "CLOSE";

export interface SpinState {
  current: SpinStage;
  completed: SpinStage[];
}

export const SPIN_ORDER: SpinStage[] = [
  "SITUATION",
  "PROBLEM",
  "IMPLICATION",
  "NEED_PAYOFF",
  "CTQ",
  "BUSINESS_CASE",
  "OFFER",
  "CLOSE"
];

export function nextStage(state: SpinState): SpinStage {
  const index = SPIN_ORDER.indexOf(state.current);
  return SPIN_ORDER[Math.min(index + 1, SPIN_ORDER.length - 1)];
}
""",

    "apps/worker/src/domain/salesContext.ts": """import type { SpinStage } from "./spin";

export interface SalesContext {
  sessionId: string;
  sellerId?: string;
  company?: {
    name?: string;
    sector?: string;
    size?: string;
  };
  buyer?: {
    name?: string;
    role?: string;
  };
  spin: {
    stage: SpinStage;
    confidence: number;
  };
  conversation: {
    lastBuyerUtterance?: string;
    lastSellerUtterance?: string;
  };
  problems: string[];
  ctqs: Array<{
    name: string;
    currentValue?: string | number;
    targetValue?: string | number;
    unit?: string;
    confidence: number;
  }>;
  impacts: Array<{
    description: string;
    estimatedValue?: number;
    currency?: string;
    confidence: number;
  }>;
  nextAction?: {
    type: "QUESTION" | "CONFIRM" | "SUMMARIZE" | "OFFER" | "CLOSE";
    text: string;
    reason: string;
  };
}
""",

    "apps/worker/src/domain/nextBestQuestion.ts": """import type { SalesContext } from "./salesContext";
import type { SpinStage } from "./spin";

const QUESTIONS: Record<SpinStage, string[]> = {
  SITUATION: [
    "Como funciona hoje esse processo, desde o início até o resultado final?"
  ],
  PROBLEM: [
    "Onde você percebe que esse processo mais perde eficiência ou dinheiro?"
  ],
  IMPLICATION: [
    "Quando isso acontece, qual é o impacto disso no faturamento, custo ou margem?"
  ],
  NEED_PAYOFF: [
    "Se esse problema fosse reduzido significativamente, o que mudaria no resultado da empresa?"
  ],
  CTQ: [
    "Qual indicador você considera mais importante para saber se esse processo está funcionando bem?"
  ],
  BUSINESS_CASE: [
    "Se conseguíssemos melhorar esse indicador, quanto isso poderia representar por mês?"
  ],
  OFFER: [
    "Faz sentido eu mostrar um plano objetivo para atacar exatamente esse gargalo?"
  ],
  CLOSE: [
    "Podemos definir agora o próximo passo para iniciar o diagnóstico?"
  ]
};

export function suggestNextQuestion(context: SalesContext) {
  const questions = QUESTIONS[context.spin.stage];
  const text = questions[0];

  return {
    type: "QUESTION" as const,
    text,
    reason: `Próxima ação recomendada para a etapa ${context.spin.stage}.`
  };
}
""",

    "apps/worker/src/application/createSession.ts": """import type { SpinStage } from "../domain/spin";

export function createSession(input: Record<string, unknown>) {
  const sessionId = crypto.randomUUID();

  return {
    sessionId,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    spin: {
      stage: "SITUATION" as SpinStage,
      confidence: 1
    },
    buyer: input.buyer ?? {},
    company: input.company ?? {}
  };
}
""",

    "apps/worker/src/application/processTranscript.ts": """import { suggestNextQuestion } from "../domain/nextBestQuestion";
import type { SalesContext } from "../domain/salesContext";

export function processTranscript(input: Record<string, unknown>) {
  const buyerUtterance = String(input.buyerUtterance ?? "");

  const context: SalesContext = {
    sessionId: String(input.sessionId ?? "unknown"),
    spin: {
      stage: (input.stage as SalesContext["spin"]["stage"]) ?? "SITUATION",
      confidence: 0.5
    },
    conversation: {
      lastBuyerUtterance: buyerUtterance
    },
    problems: [],
    ctqs: [],
    impacts: []
  };

  const nextAction = suggestNextQuestion(context);

  return {
    sessionId: context.sessionId,
    detected: {
      buyerUtterance,
      problems: context.problems,
      ctqs: context.ctqs,
      impacts: context.impacts
    },
    spin: context.spin,
    nextAction
  };
}
""",

    "apps/worker/tests/spin.test.ts": """import { describe, expect, it } from "vitest";
import { nextStage } from "../src/domain/spin";

describe("SPIN state machine", () => {
  it("moves from Situation to Problem", () => {
    expect(
      nextStage({ current: "SITUATION", completed: [] })
    ).toBe("PROBLEM");
  });

  it("moves from Problem to Implication", () => {
    expect(
      nextStage({ current: "PROBLEM", completed: ["SITUATION"] })
    ).toBe("IMPLICATION");
  });
});
""",

    "apps/worker/tests/nextBestQuestion.test.ts": """import { describe, expect, it } from "vitest";
import { suggestNextQuestion } from "../src/domain/nextBestQuestion";

describe("Next Best Question Engine", () => {
  it("suggests a problem question in Problem stage", () => {
    const result = suggestNextQuestion({
      sessionId: "test",
      spin: { stage: "PROBLEM", confidence: 0.9 },
      conversation: {},
      problems: [],
      ctqs: [],
      impacts: []
    });

    expect(result.type).toBe("QUESTION");
    expect(result.text.length).toBeGreaterThan(10);
  });
});
""",

    "contracts/transcript-input.schema.json": """{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TranscriptInput",
  "type": "object",
  "required": ["sessionId", "buyerUtterance"],
  "properties": {
    "sessionId": { "type": "string" },
    "buyerUtterance": { "type": "string" },
    "sellerUtterance": { "type": "string" },
    "stage": {
      "type": "string",
      "enum": [
        "SITUATION",
        "PROBLEM",
        "IMPLICATION",
        "NEED_PAYOFF",
        "CTQ",
        "BUSINESS_CASE",
        "OFFER",
        "CLOSE"
      ]
    }
  },
  "additionalProperties": false
}
""",

    "contracts/next-action.schema.json": """{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "NextAction",
  "type": "object",
  "required": ["type", "text", "reason"],
  "properties": {
    "type": {
      "type": "string",
      "enum": ["QUESTION", "CONFIRM", "SUMMARIZE", "OFFER", "CLOSE"]
    },
    "text": { "type": "string" },
    "reason": { "type": "string" }
  },
  "additionalProperties": false
}
""",

    "prompts/system-sales-copilot-v0.1.md": """# Sales Copilot — System Prompt v0.1

## Papel

Você é um Copiloto de Engenharia de Vendas especializado em SPIN Selling,
Lean Six Sigma e descoberta de CTQs.

## Objetivo

Ajudar o vendedor a conduzir uma conversa consultiva sem substituir sua decisão.

## Regras

1. Analise prioritariamente a fala do comprador.
2. Identifique a etapa SPIN mais provável.
3. Extraia problemas explícitos ou sinais de problemas.
4. Procure evidências que possam virar CTQs mensuráveis.
5. Procure impacto financeiro, operacional ou de experiência.
6. Gere apenas UMA próxima ação principal.
7. A pergunta deve ser curta e natural para ser falada pelo vendedor.
8. Não invente números.
9. Diferencie fato, inferência e hipótese.
10. Não pule para a oferta antes de existir problema relevante e impacto suficiente.

## Formato

Retorne JSON compatível com os contratos definidos em `/contracts`.
""",

    "supabase/migrations/001_initial_schema.sql": """create extension if not exists pgcrypto;

create table if not exists sales_sessions (
  id uuid primary key default gen_random_uuid(),
  seller_name text,
  buyer_name text,
  company_name text,
  sector text,
  spin_stage text not null default 'SITUATION',
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  speaker text not null check (speaker in ('SELLER', 'BUYER')),
  transcript text not null,
  created_at timestamptz not null default now()
);

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  description text not null,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists ctqs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  name text not null,
  current_value text,
  target_value text,
  unit text,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists impacts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  description text not null,
  estimated_value numeric,
  currency text,
  confidence numeric(5,4) default 0.5,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sales_sessions(id) on delete cascade,
  action_type text not null,
  action_text text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_turns_session
  on conversation_turns(session_id);

create index if not exists idx_problems_session
  on problems(session_id);

create index if not exists idx_ctqs_session
  on ctqs(session_id);
""",

    "supabase/seed.sql": """insert into sales_sessions
  (seller_name, buyer_name, company_name, sector)
values
  ('Pedro', 'João', 'Academia Exemplo', 'Fitness');
""",

    "docs/architecture.md": """# Arquitetura — Sprint 1

## Componentes

### 1. Transcrição
Recebe o texto produzido pelo mecanismo de reconhecimento de fala.

### 2. Context Builder
Mantém uma visão compacta da conversa.

### 3. SPIN State Machine
Controla a etapa comercial atual.

### 4. Signal Extractor
Extrai:
- situação
- problema
- implicação
- necessidade
- CTQ
- impacto financeiro

### 5. Next Best Question Engine
Seleciona a próxima intervenção.

### 6. LLM Adapter
Futuramente interpreta linguagem natural e retorna objetos estruturados.

### 7. Persistence
Supabase registra a sessão e os eventos.

## Regra de arquitetura

O LLM não deve possuir sozinho o controle do fluxo comercial.
A máquina de estados e regras de negócio permanecem determinísticas.
""",

    "docs/spin-flow.md": """# Fluxo SPIN

```text
SITUATION
   ↓
PROBLEM
   ↓
IMPLICATION
   ↓
NEED_PAYOFF
   ↓
CTQ
   ↓
BUSINESS_CASE
   ↓
OFFER
   ↓
CLOSE
```

A transição não deve ocorrer apenas porque uma pergunta foi feita.
O sistema deve procurar evidência na resposta do comprador.
""",

    "docs/api.md": """# API — Sprint 1

## GET /health

Verifica o serviço.

## POST /sessions

Cria uma sessão comercial.

Exemplo:

```json
{
  "buyer": { "name": "João", "role": "Sócio" },
  "company": { "name": "Academia Exemplo", "sector": "Fitness" }
}
```

## POST /transcript

Processa uma fala do comprador.

Exemplo:

```json
{
  "sessionId": "uuid",
  "buyerUtterance": "A gente recebe muitos leads, mas poucos acabam fechando."
}
```
""",

    "scripts/dev-check.sh": """#!/usr/bin/env bash
set -e

echo "== Sales Copilot / Sprint 1 =="
echo "Checking project structure..."

test -f README.md
test -f apps/worker/src/index.ts
test -f apps/worker/src/domain/spin.ts
test -f supabase/migrations/001_initial_schema.sql

echo "OK: estrutura encontrada."
""",

    "docker-compose.yml": """services:
  worker:
    image: node:22-alpine
    working_dir: /app
    volumes:
      - ./apps/worker:/app
    ports:
      - "8787:8787"
    command: sh -c "npm install && npm run dev -- --ip 0.0.0.0"
""",

    ".github/workflows/test.yml": """name: test

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: apps/worker

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm install
      - run: npm test
      - run: npm run typecheck
"""
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default="sales-copilot", help="Diretório do projeto")
    args = parser.parse_args()

    base = Path(args.root).resolve()
    base.mkdir(parents=True, exist_ok=True)

    for relative, content in FILES.items():
        path = base / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    for executable in [
        "scripts/dev-check.sh"
    ]:
        try:
            (base / executable).chmod(0o755)
        except OSError:
            pass

    print()
    print("Sales Copilot — Sprint 1 criado com sucesso!")
    print(f"Diretório: {base}")
    print(f"Arquivos: {len(FILES)}")
    print()
    print("Próximos comandos:")
    print(f"  cd {base.name}")
    print("  git init")
    print("  git add .")
    print('  git commit -m "chore: bootstrap sprint 1"')
    print("  git branch -M main")
    print("  git remote add origin <URL_DO_REPOSITORIO>")
    print("  git push -u origin main")
    print()

if __name__ == "__main__":
    main()
