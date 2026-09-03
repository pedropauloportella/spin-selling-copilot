import type {
  SalesContext
} from "../domain/salesContext";

import type {
  ConversationAnalyzer
} from "../infrastructure/ai/types";

import {
  detectCTQs
} from "../intelligence/ctqDetector";

import {
  detectInformationGaps
} from "../intelligence/informationGap";

import {
  nextBestAction
} from "../intelligence/nextBestAction";

export async function analyzeConversation(
  context: SalesContext,

  buyerUtterance: string,

  analyzer: ConversationAnalyzer
): Promise<SalesContext> {

  const analysis =
    await analyzer.analyze({

      buyerUtterance,

      currentStage:
        context.spin.stage,

      sector:
        context.company?.sector
    });

  context.spin = {
    stage:
      analysis.detectedStage,

    confidence:
      analysis.stageConfidence
  };

  context.conversation.lastBuyerUtterance =
    buyerUtterance;

  const newProblems =
    analysis.problems.map(problem => ({

      id: crypto.randomUUID(),

      description:
        problem.description,

      process:
        problem.process,

      status:
        "CANDIDATE" as const,

      evidence: [{
        id: crypto.randomUUID(),

        type:
          "CUSTOMER_STATEMENT" as const,

        text:
          buyerUtterance,

        sourceSpeaker:
          "BUYER" as const,

        timestamp:
          new Date().toISOString(),

        confidence:
          problem.confidence
      }],

      confidence:
        problem.confidence
    }));

  context.problems.push(
    ...newProblems
  );

  const detectedCTQs =
    detectCTQs(
      context.problems
    );

  context.ctqs =
    detectedCTQs;

  context.informationGaps =
    detectInformationGaps(
      context
    );

  context.nextAction =
    nextBestAction(
      context
    );

  return context;
}