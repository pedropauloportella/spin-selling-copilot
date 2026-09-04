import type { SalesContext } from "../domain/salesContext";
import { MockAnalyzer } from "../infrastructure/ai/mockAnalyzer";

import {
  analyzeConversationIntelligence
} from "../intelligence/conversationIntelligence";

import {
  suggestNextQuestion
} from "../domain/nextBestQuestion";

export interface ProcessTranscriptInput {
  sessionId: string;
  transcript: string;
  context: SalesContext;
}

export async function processTranscript(
  input: ProcessTranscriptInput
) {
  const analyzer = new MockAnalyzer();

const intelligence =
  await analyzeConversationIntelligence(
    analyzer,
    {
      buyerUtterance: input.transcript,
      currentStage: input.context.spin.stage
    }
  );

  const nextQuestion =
    suggestNextQuestion({
      ...input.context,
      spin: {
        stage: intelligence.detectedStage,
        confidence: intelligence.confidence
      }
    });

  return {
    sessionId: input.sessionId,
    transcript: input.transcript,
    intelligence,
    nextQuestion
  };
}