import type { SpinStage } from "./spin";
import type { Problem } from "./problem";
import type { CTQ } from "./ctq";
import type { Evidence } from "./evidence";

export interface InformationGap {
  field: string;

  reason: string;

  priority: number;
}

export interface BusinessImpact {
  description: string;

  value?: number;

  currency?: string;

  period?: string;

  confidence: number;
}

export interface SalesContext {
  sessionId: string;

  sellerId?: string;

  company?: {
    name?: string;
    sector?: string;
    size?: string;
  };

  buyer?: {
    name?: string;
    role?: string;
  };

  spin: {
    stage: SpinStage;
    confidence: number;
  };

  conversation: {
    lastBuyerUtterance?: string;
    lastSellerUtterance?: string;
  };

  evidence: Evidence[];

  problems: Problem[];

  ctqs: CTQ[];

  impacts: BusinessImpact[];

  informationGaps: InformationGap[];

  nextAction?: {
    type:
      | "QUESTION"
      | "CONFIRM"
      | "SUMMARIZE"
      | "OFFER"
      | "CLOSE";

    text: string;

    reason: string;
  };
}