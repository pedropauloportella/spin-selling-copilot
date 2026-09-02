# API — Sprint 1

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
