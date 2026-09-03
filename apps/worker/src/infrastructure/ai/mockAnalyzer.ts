import type {
  ConversationAnalysis,
  ConversationAnalyzer
} from "./types";

export class MockAnalyzer implements ConversationAnalyzer {

  async analyze(input: {
    buyerUtterance: string;

    sellerUtterance?: string;

    currentStage: ConversationAnalysis["detectedStage"];

    sector?: string;
  }): Promise<ConversationAnalysis> {

    const text = input.buyerUtterance.toLowerCase();

    const problems = [];

    if (
      text.includes("poucos fecham") ||
      text.includes("baixa conversão") ||
      text.includes("não viram matrícula")
    ) {
      problems.push({
        description:
          "Baixa conversão de leads em matrículas",

        process: "Vendas",

        confidence: 0.9
      });
    }

    if (
      text.includes("perdendo clientes") ||
      text.includes("cancelamento") ||
      text.includes("churn")
    ) {
      problems.push({
        description:
          "Perda de clientes",

        process: "Retenção",

        confidence: 0.9
      });
    }

    if (
      text.includes("demora") ||
      text.includes("muito tempo para responder")
    ) {
      problems.push({
        description:
          "Tempo elevado de resposta",

        process: "Atendimento",

        confidence: 0.85
      });
    }

    return {
      detectedStage:
        problems.length > 0
          ? "PROBLEM"
          : input.currentStage,

      stageConfidence:
        problems.length > 0
          ? 0.85
          : 0.5,

      problems,

      metrics: [],

      impacts: [],

      facts: [],

      hypotheses: []
    };
  }
}