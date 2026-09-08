import type { SalesContext } from "../domain/salesContext";
import type { ConversationAnalyzer } from "../infrastructure/ai/analyzer";
import { MockAnalyzer } from "../infrastructure/ai/mockAnalyzer";
import { analyzeConversation } from "./analyzeConversation";

export interface ProcessTranscriptInput {
  sessionId: string;
  buyerUtterance: string;
  context: SalesContext;
  analyzer?: ConversationAnalyzer;
}

export async function processTranscript(
  input: ProcessTranscriptInput
) {
  const context = await analyzeConversation(
    structuredClone(input.context),
    input.buyerUtterance,
    input.analyzer ?? new MockAnalyzer()
  );

  return {
    sessionId: input.sessionId,
    transcript: input.buyerUtterance,
    context,
    nextAction: context.nextAction
  };
}
