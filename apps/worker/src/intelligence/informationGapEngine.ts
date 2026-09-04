import type { MetricContext } from "../domain/metricContext";
import type {
  InformationGap,
  InformationGapType
} from "../domain/informationGap";

export interface InformationGapAnalysis {
  gaps: InformationGap[];
  nextGap?: InformationGap;
}

function createGap(
  type: InformationGapType,
  description: string,
  suggestedQuestion: string,
  priority: InformationGap["priority"] = "HIGH"
): InformationGap {
  return {
    type,
    description,
    priority,
    resolved: false,
    suggestedQuestion
  };
}

export function analyzeInformationGaps(
  metricContext?: MetricContext
): InformationGapAnalysis {
  const gaps: InformationGap[] = [];

  if (!metricContext) {
    gaps.push(
      createGap(
        "PROBLEM_QUANTITY",
        "Ainda não existe uma métrica associada ao problema.",
        "Você consegue quantificar esse problema em números?"
      )
    );

    return {
      gaps,
      nextGap: gaps[0]
    };
  }

  if (!metricContext.baseline) {
    gaps.push(
      createGap(
        "BASELINE",
        "O valor atual do indicador ainda não foi identificado.",
        "Qual é o resultado atual desse indicador?"
      )
    );
  }

  if (!metricContext.target) {
    gaps.push(
      createGap(
        "TARGET",
        "A meta desejada ainda não foi identificada.",
        "Qual resultado vocês gostariam de alcançar?"
      )
    );
  }

  if (
    metricContext.baseline &&
    metricContext.target &&
    !metricContext.gap
  ) {
    gaps.push(
      createGap(
        "TARGET",
        "Não foi possível calcular o intervalo entre o resultado atual e a meta.",
        "Podemos confirmar o resultado atual e a meta desejada?"
      )
    );
  }

  if (!metricContext.volume) {
    gaps.push(
      createGap(
        "VOLUME",
        "O volume de oportunidades ainda não foi identificado.",
        "Qual é o volume mensal relacionado a esse indicador?"
      )
    );
  }

  if (!metricContext.unitValue) {
    gaps.push(
      createGap(
        "UNIT_VALUE",
        "O valor financeiro unitário ainda não foi identificado.",
        "Qual é o valor médio de cada venda, matrícula ou cliente?"
      )
    );
  }

  return {
    gaps,
    nextGap: gaps[0]
  };
}