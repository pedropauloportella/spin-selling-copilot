import { describe, expect, it } from "vitest";
import { suggestNextQuestion } from "../src/domain/nextBestQuestion";

describe("Next Best Question Engine", () => {
  it("suggests a problem question in Problem stage", () => {
    const result = suggestNextQuestion({
      sessionId: "test",
      spin: { stage: "PROBLEM", confidence: 0.9 },
      conversation: {},
      problems: [],
      ctqs: [],
      impacts: []
    });

    expect(result.type).toBe("QUESTION");
    expect(result.text.length).toBeGreaterThan(10);
  });
});
