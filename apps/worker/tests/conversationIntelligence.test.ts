import { describe, expect, it } from "vitest";

import { MockAnalyzer } from "../src/infrastructure/ai/mockAnalyzer";

import {
  analyzeConversationIntelligence
} from "../src/intelligence/conversationIntelligence";

describe("conversationIntelligence", () => {
  it("combines AI interpretation and quantitative analysis", async () => {
    const analyzer = new MockAnalyzer();

    const result = await analyzeConversationIntelligence(
      analyzer,
      {
        buyerUtterance:
  "Estamos perdendo muitos clientes. Recebemos 600 leads e apenas 40 viraram matrícula.",
        currentStage: "PROBLEM"
      }
    );

    expect(result.detectedStage)
      .toBe("PROBLEM");

    expect(result.problem)
      .toBeDefined();

    expect(result.metrics.length)
      .toBeGreaterThan(0);

    expect(
      result.metrics.some(
        (metric) => metric.name === "conversion_rate"
      )
    ).toBe(true);
  });
});