import { describe, expect, it } from "vitest";
import { MockAnalyzer } from "../src/infrastructure/ai/mockAnalyzer";
import { analyzeConversationIntelligence } from "../src/intelligence/conversationIntelligence";

describe("Inteligência comercial", () => {
  it("transforma uma fala problemática em próxima ação", async () => {
    const analyzer = new MockAnalyzer();

    const result = await analyzeConversationIntelligence(analyzer, {
      buyerUtterance:
        "Estamos recebendo muitos leads, mas poucos viram alunos. Nossa conversão caiu bastante e não sabemos onde estamos perdendo essas oportunidades.",
      currentStage: "SITUATION",
      sector: "academia"
    });

    expect(result.confidence).toBeGreaterThan(0);
    expect(result.summary).toContain("leads");
    expect(result.problem).toBeDefined();
    expect(result.metrics).toEqual([]);
  });
});