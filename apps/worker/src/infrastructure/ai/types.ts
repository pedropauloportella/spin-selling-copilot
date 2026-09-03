import type { SpinStage } from "../../domain/spin";

export interface ExtractedProblem {
  description: string;

  process?: string;

  confidence: number;
}

export interface ExtractedMetric {
  name: string;

  value?: number;

  unit?: string;

  target?: number;

  confidence: number;
}

export interface ConversationAnalysis {
  detectedStage: SpinStage;

  stageConfidence: number;

  problems: ExtractedProblem[];

  metrics: ExtractedMetric[];

  impacts: Array<{
    description: string;

    value?: number;

    currency?: string;

    confidence: number;
  }>;

  facts: string[];

  hypotheses: string[];
}

export interface ConversationAnalyzer {
  analyze(input: {
    buyerUtterance: string;

    sellerUtterance?: string;

    currentStage: SpinStage;

    sector?: string;
  }): Promise<ConversationAnalysis>;
}