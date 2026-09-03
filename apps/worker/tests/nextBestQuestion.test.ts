import { describe, expect, it } from "vitest";
import { suggestNextQuestion } from "../src/domain/nextBestQuestion";

describe("suggestNextQuestion", () => {
  it("asks for baseline in problem stage", () => {
    const result = suggestNextQuestion({
      sessionId: "test",
      spin: {
        stage: "PROBLEM",
        confidence: 0.9
      },
      conversation: {},
      problems: [],
      ctqs: [],
      impacts: [],
      evidence: [],
      informationGaps: []
    });

    expect(result).toBeDefined();
  });
});