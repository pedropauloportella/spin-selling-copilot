import type {
  SalesContext
} from "../domain/salesContext";

import {
  analyzeConversation
} from "../application/analyzeConversation";

import {
  MockAnalyzer
} from "../infrastructure/ai/mockAnalyzer";

export async function processTranscript(
  input: Record<string, unknown>
) {

  const context =
    input.context as SalesContext;

  const buyerUtterance =
    String(
      input.buyerUtterance ?? ""
    );

  const analyzer =
    new MockAnalyzer();

  const updatedContext =
    await analyzeConversation(

      context,

      buyerUtterance,

      analyzer
    );

  return {
    sessionId:
      updatedContext.sessionId,

    spin:
      updatedContext.spin,

    problems:
      updatedContext.problems,

    ctqs:
      updatedContext.ctqs,

    informationGaps:
      updatedContext.informationGaps,

    nextAction:
      updatedContext.nextAction
  };
}