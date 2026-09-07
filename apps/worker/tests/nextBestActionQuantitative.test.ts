import { describe, expect, it } from "vitest";
import { nextBestAction } from "../src/intelligence/nextBestAction";
import type { SalesContext } from "../src/domain/salesContext";

describe("Próxima melhor ação - investigação quantitativa", () => {
  it("pergunta pela dimensão do problema quando a medição está ausente", () => {
    const context: SalesContext = {
      sessionId: "test-session",

      spin: {
        stage: "PROBLEM",
        confidence: 0.9
      },

      conversation: {
        lastBuyerUtterance:
          "Recebemos muitos leads, mas poucos viram alunos."
      },

      evidence: [],
      problems: [],
      ctqs: [],
      impacts: [],

      informationGaps: [
        {
          field: "problem.measurement",
          reason: "O problema foi identificado, mas ainda não foi quantificado.",
          priority: 1
        }
      ]
    };

    const result = nextBestAction(context);

    expect(result.type).toBe("QUESTION");

    expect(result.text).toBe(
      "Você consegue estimar com que frequência isso acontece ou qual é a dimensão desse problema hoje?"
    );

    expect(result.reason).toBe(
      "O problema foi identificado, mas ainda não foi quantificado."
    );
  });
});