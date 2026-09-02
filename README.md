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

## Próximo passo

Após criar o repositório, configurar:

- GitHub
- Supabase
- Cloudflare
- variáveis de ambiente
- OpenAI API

