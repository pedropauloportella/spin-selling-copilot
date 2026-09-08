# Sales Copilot — Sprint 1

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

## Como executar

1. Aplique as migrations em ordem no projeto Supabase (`001_initial_schema.sql` e `002_session_context_and_consent.sql`).
2. Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` como secrets do Worker. A chave de serviço não deve ser exposta ao frontend.
3. Em `apps/worker`, execute `npm run dev` para desenvolvimento ou `npm run deploy` para publicar.
4. Crie uma sessão em `POST /sessions` com `recordingConsent: true` e envie falas do comprador para `POST /transcript`.

## Próximas integrações

O MVP processa transcrições textuais. Quando `OPENAI_API_KEY` e `OPENAI_MODEL` estão configurados, o Worker usa a Responses API com saída estruturada; se a chamada falhar ou as variáveis estiverem ausentes, usa o analisador determinístico de desenvolvimento. A integração de áudio/realtime continua fora do escopo atual.

## Teste com Postman

Importe [a collection local](postman/Sales-Copilot.local.postman_collection.json) no Postman, informe um JWT de usuário na variável `accessToken` e execute as requisições na ordem: `Health`, `Criar sessão` e `Processar transcrição`. A collection guarda automaticamente o `sessionId` retornado na segunda requisição.

- GitHub
- Supabase
- Cloudflare
- variáveis de ambiente
- OpenAI API

