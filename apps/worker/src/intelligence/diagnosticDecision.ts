import type { MetricContext } from "../domain/metricContext";
import {
  analyzeInformationGaps
} from "./informationGapEngine";

export type DiagnosticAction =
  | "ASK_QUANTIFICATION"
  | "ASK_BASELINE"
  | "ASK_TARGET"
  | "ASK_VOLUME"
  | "ASK_UNIT_VALUE"
  | "CALCULATE_IMPACT"
  | "VALIDATE_NEED_PAYOFF"
  | "PROPOSE_PROJECT";

export interface DiagnosticDecision {
  action: DiagnosticAction;
  reason: string;
  question?: string;
}

export function decideDiagnosticAction(
  metricContext?: MetricContext
): DiagnosticDecision {
  const analysis = analyzeInformationGaps(metricContext);

  if (analysis.nextGap) {
    const gap = analysis.nextGap;

    const actionMap: Record<
      typeof gap.type,
      DiagnosticAction
    > = {
      PROBLEM_QUANTITY: "ASK_QUANTIFICATION",
      BASELINE: "ASK_BASELINE",
      TARGET: "ASK_TARGET",
      VOLUME: "ASK_VOLUME",
      UNIT_VALUE: "ASK_UNIT_VALUE",
      ROOT_CAUSE: "ASK_QUANTIFICATION",
      NEED_PAYOFF: "VALIDATE_NEED_PAYOFF"
    };

    return {
      action: actionMap[gap.type],
      reason: gap.description,
      question: gap.suggestedQuestion
    };
  }

  if (
    metricContext?.baseline &&
    metricContext.target &&
    metricContext.volume &&
    metricContext.unitValue
  ) {
    return {
      action: "CALCULATE_IMPACT",
      reason: "As informações necessárias para estimar o impacto estão disponíveis."
    };
  }

  return {
    action: "ASK_QUANTIFICATION",
    reason: "Ainda são necessárias informações para quantificar o problema."
  };
}