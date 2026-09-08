import { describe, expect, it } from "vitest";
import { MockAnalyzer } from "../src/infrastructure/ai/mockAnalyzer";

describe("Cenário comercial - academia", () => {
  it("identifica um problema de conversão e sugere investigação quantitativa", async () => {
    const analyzer = new MockAnalyzer();

    const result = await analyzer.analyze({
      buyerUtterance:
        "Estamos recebendo muitos leads, mas poucos viram alunos. Nossa conversão caiu bastante e não sabemos onde estamos perdendo essas oportunidades.",
      currentStage: "SITUATION",
      sector: "academia"
    });

    expect(result.detectedStage).toBe("PROBLEM");
    expect(result.stageConfidence).toBeGreaterThan(0);
    expect(result.problems.length).toBeGreaterThan(0);
    expect(result.metrics).toEqual([]);
  });

  it("reconhece uma conversão baixa expressa por quantidades", async () => {
    const analyzer = new MockAnalyzer();

    const result = await analyzer.analyze({
      buyerUtterance: "Recebemos 600 leads por mês, mas apenas 40 viram matrícula.",
      currentStage: "SITUATION",
      sector: "academia"
    });

    expect(result.detectedStage).toBe("PROBLEM");
    expect(result.problems).toHaveLength(1);
  });
});
