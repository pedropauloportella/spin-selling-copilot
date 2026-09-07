import { describe, expect, it } from "vitest";
import { buildSalesContext } from "../src/intelligence/salesContextBuilder";
import type { ConversationIntelligenceResult } from "../src/intelligence/conversationIntelligence";

describe("SalesContextBuilder", () => {
  it("constrói o contexto comercial e recomenda a próxima ação", () => {
    const intelligence: ConversationIntelligenceResult = {
      detectedStage: "PROBLEM",
      confidence: 0.9,
      summary:
        "Recebemos muitos leads, mas poucos viram alunos.",

      problem: {
        description: "Baixa conversão de leads em alunos",
        confidence: 0.88
      },

      metrics: [],

      suggestedQuestion:
        "Qual é a taxa atual de conversão?"
    };

    const context = buildSalesContext({
      sessionId: "test-session",
      buyerUtterance:
        "Recebemos muitos leads, mas poucos viram alunos.",
      sector: "Academias",
      intelligence
    });

    expect(context.sessionId).toBe("test-session");
    expect(context.spin.stage).toBe("PROBLEM");
    expect(context.problems).toHaveLength(1);

    expect(context.nextAction).toBeDefined();
    expect(context.nextAction?.type).toBe("QUESTION");
  });
});