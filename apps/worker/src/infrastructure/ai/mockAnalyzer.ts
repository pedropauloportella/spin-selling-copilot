import type { ConversationAnalyzer } from "./analyzer";
import type { ConversationAnalysis } from "./types";
import type { SpinStage } from "../../domain/spin";

export class MockAnalyzer implements ConversationAnalyzer {
  async analyze(input: {
    buyerUtterance: string;
    sellerUtterance?: string;
    currentStage: SpinStage;
    sector?: string;
  }): Promise<ConversationAnalysis> {
    const text = [
      input.buyerUtterance,
      input.sellerUtterance ?? ""
    ]
      .join(" ")
      .trim()
      .toLowerCase();

    const hasProblem =
      text.includes("problema") ||
      text.includes("perdendo") ||
      text.includes("baixa conversão") ||
      text.includes("poucos") ||
      text.includes("poucas") ||
      (
        text.includes("lead") &&
        (
          text.includes("apenas") ||
          text.includes("somente") ||
          text.includes("só") ||
          text.includes("matrícula") ||
          text.includes("matricula") ||
          text.includes("fecham")
        )
      );

    return {
      detectedStage: hasProblem ? "PROBLEM" : input.currentStage,
      stageConfidence: hasProblem ? 0.85 : 0.7,
      problems: hasProblem
        ? [
            {
              description: text,
              confidence: 0.8
            }
          ]
        : [],
      impacts: [],
      facts: [],
      hypotheses: [],
      metrics: []
    };
  }
}
