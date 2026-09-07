import type { SalesContext } from "../domain/salesContext";
import type { ConversationIntelligenceResult } from "./conversationIntelligence";
import { nextBestAction } from "./nextBestAction";

interface BuildSalesContextInput {
  sessionId: string;
  sellerId?: string;
  buyerName?: string;
  buyerRole?: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  buyerUtterance: string;
  sellerUtterance?: string;
  intelligence: ConversationIntelligenceResult;
}

export function buildSalesContext(
  input: BuildSalesContextInput
): SalesContext {
  const {
    intelligence
  } = input;

  const problems = intelligence.problem
    ? [
        {
          id: `problem-${input.sessionId}`,
          description: intelligence.problem.description,
          confidence: intelligence.problem.confidence,
          status: "CANDIDATE" as const,
          evidence: []
        }
      ]
    : [];

const informationGaps = intelligence.problem
    ? [
        {
          field: "problem.measurement",
          reason:
            "O problema foi identificado, mas ainda não foi quantificado.",
          priority: 1
        }
      ]
    : [];

  const context: SalesContext = {
    sessionId: input.sessionId,
    sellerId: input.sellerId,

    company: {
      name: input.companyName,
      sector: input.sector,
      size: input.companySize
    },

    buyer: {
      name: input.buyerName,
      role: input.buyerRole
    },

    spin: {
      stage: intelligence.detectedStage,
      confidence: intelligence.confidence
    },

    conversation: {
      lastBuyerUtterance: input.buyerUtterance,
      lastSellerUtterance: input.sellerUtterance
    },

    evidence: [],
    problems,
    ctqs: [],
    impacts: [],
    informationGaps
  };

  

  context.nextAction = nextBestAction(context);

  return context;
}