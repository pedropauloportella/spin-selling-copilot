import type { SpinStage } from "./spin";

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
  problems: string[];
  ctqs: Array<{
    name: string;
    currentValue?: string | number;
    targetValue?: string | number;
    unit?: string;
    confidence: number;
  }>;
  impacts: Array<{
    description: string;
    estimatedValue?: number;
    currency?: string;
    confidence: number;
  }>;
  nextAction?: {
    type: "QUESTION" | "CONFIRM" | "SUMMARIZE" | "OFFER" | "CLOSE";
    text: string;
    reason: string;
  };
}
