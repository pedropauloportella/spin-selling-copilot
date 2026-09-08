# API — Sprint 1

## GET /health

Verifica o serviço.

## POST /sessions

Cria uma sessão comercial.

Exige `Authorization: Bearer <access-token>` de um usuário do Supabase Auth. A sessão é vinculada ao usuário autenticado.

Exemplo:

```json
{
  "recordingConsent": true,
  "retentionDays": 90,
  "buyer": { "name": "João", "role": "Sócio" },
  "company": { "name": "Academia Exemplo", "sector": "Fitness" }
}
```

`recordingConsent` é obrigatório. Sem consentimento registrado, uma transcrição não é processada.

## POST /transcript

Processa uma fala do comprador.

Exige o mesmo `Authorization: Bearer <access-token>` do proprietário da sessão.

Exemplo:

```json
{
  "sessionId": "uuid",
  "buyerUtterance": "A gente recebe muitos leads, mas poucos acabam fechando."
}
```

O Worker recupera e atualiza o contexto persistido da sessão. As rotas não possuem prefixo `/api`.
