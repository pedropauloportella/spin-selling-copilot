import type { SpinStage } from "../../domain/spin";
import type { ConversationAnalysis } from "./types";

export interface ConversationAnalyzer {
  analyze(input: {
    buyerUtterance: string;
    sellerUtterance?: string;
    currentStage: SpinStage;
    sector?: string;
  }): Promise<ConversationAnalysis>;
}