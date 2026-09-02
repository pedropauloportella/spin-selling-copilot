import { describe, expect, it } from "vitest";
import { nextStage } from "../src/domain/spin";

describe("SPIN state machine", () => {
  it("moves from Situation to Problem", () => {
    expect(
      nextStage({ current: "SITUATION", completed: [] })
    ).toBe("PROBLEM");
  });

  it("moves from Problem to Implication", () => {
    expect(
      nextStage({ current: "PROBLEM", completed: ["SITUATION"] })
    ).toBe("IMPLICATION");
  });
});
