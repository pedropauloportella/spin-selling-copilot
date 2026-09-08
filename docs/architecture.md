# Arquitetura — Sprint 1

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
Supabase registra a sessão, o contexto estruturado (`sales_context`) e cada fala.
O Worker usa a chave de serviço apenas no backend; ela nunca é enviada ao frontend.

O processamento de uma fala segue esta ordem:

1. recupera a sessão e confirma o consentimento;
2. analisa a fala e atualiza o `SalesContext`;
3. grava a fala e o contexto atualizado;
4. devolve somente uma próxima ação ao vendedor.

## Regra de arquitetura

O LLM não deve possuir sozinho o controle do fluxo comercial.
A máquina de estados e regras de negócio permanecem determinísticas.
