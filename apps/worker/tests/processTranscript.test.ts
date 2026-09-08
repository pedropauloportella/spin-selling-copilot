import { describe, expect, it } from "vitest";
import { createSession } from "../src/application/createSession";
import { processTranscript } from "../src/application/processTranscript";

describe("processTranscript", () => {
  it("updates the persisted sales context and returns one next action", async () => {
    const session = createSession({
      recordingConsent: true,
      company: { sector: "Fitness" }
    });

    const result = await processTranscript({
      sessionId: session.sessionId,
      buyerUtterance: "Recebemos muitos leads, mas poucos fecham matrícula.",
      context: session.context
    });

    expect(result.context.spin.stage).toBe("PROBLEM");
    expect(result.context.ctqs[0]?.metric).toBe("lead_conversion_rate");
    expect(result.nextAction?.type).toBe("QUESTION");
  });
});
