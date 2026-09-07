import type { Metric } from "../domain/metric";
import type { SpinStage } from "../domain/spin";
import type { ConversationAnalyzer } from "../infrastructure/ai/analyzer";
import { buildSalesContext } from "./salesContextBuilder";

import {
  analyzeQuantitativeData
} from "./quantitativeAnalyzer";

import {
  analyzeBusinessMetrics
} from "./businessMetrics";

export interface ConversationIntelligenceResult {
  detectedStage: SpinStage;
  confidence: number;

  summary: string;

  problem?: {
    description: string;
    confidence: number;
  };

  metrics: Metric[];

  suggestedQuestion?: string;

  nextAction?: {
    type:
      | "QUESTION"
      | "CONFIRM"
      | "SUMMARIZE"
      | "OFFER"
      | "CLOSE";
    text: string;
    reason: string;
  };

}

export async function analyzeConversationIntelligence(
  analyzer: ConversationAnalyzer,
  input: {
    buyerUtterance: string;
    sellerUtterance?: string;
    currentStage: SpinStage;
    sector?: string;
  }
): Promise<ConversationIntelligenceResult> {
  const aiResult = await analyzer.analyze(input);

  const completeText = [
    input.buyerUtterance,
    input.sellerUtterance ?? ""
  ]
    .join(" ")
    .trim();

  const quantitativeResult =
    analyzeQuantitativeData(completeText);

  const businessResult =
    analyzeBusinessMetrics(completeText);

  const metrics = [
    ...quantitativeResult.metrics,
    ...businessResult.metrics.map((metric) => ({
      name: metric.name,
      value: metric.value,
      unit: metric.unit as Metric["unit"],
      type: "RATE" as const,
      sourceText: metric.sourceText,
      confidence: 0.95
    }))
  ];

  const result: ConversationIntelligenceResult = {
    ...aiResult,
    metrics,
    summary: completeText,
    detectedStage: aiResult.detectedStage,
    confidence: aiResult.stageConfidence,
    problem: aiResult.problems[0],
    suggestedQuestion: aiResult.hypotheses[0]
  };

   const salesContext = buildSalesContext({
    sessionId: `session-${Date.now()}`,
    buyerUtterance: input.buyerUtterance,
    sellerUtterance: input.sellerUtterance,
    sector: input.sector,
    intelligence: result
  });
return {
    ...result,
    nextAction: salesContext.nextAction
  };
}