import type { SalesContext } from "./salesContext";
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
