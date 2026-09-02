import { suggestNextQuestion } from "../domain/nextBestQuestion";
import type { SalesContext } from "../domain/salesContext";

export function processTranscript(input: Record<string, unknown>) {
  const buyerUtterance = String(input.buyerUtterance ?? "");

  const context: SalesContext = {
    sessionId: String(input.sessionId ?? "unknown"),
    spin: {
      stage: (input.stage as SalesContext["spin"]["stage"]) ?? "SITUATION",
      confidence: 0.5
    },
    conversation: {
      lastBuyerUtterance: buyerUtterance
    },
    problems: [],
    ctqs: [],
    impacts: []
  };

  const nextAction = suggestNextQuestion(context);

  return {
    sessionId: context.sessionId,
    detected: {
      buyerUtterance,
      problems: context.problems,
      ctqs: context.ctqs,
      impacts: context.impacts
    },
    spin: context.spin,
    nextAction
  };
}
