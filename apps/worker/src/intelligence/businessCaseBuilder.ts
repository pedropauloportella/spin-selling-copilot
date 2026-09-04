import type { BusinessCase } from "../domain/businessCase";

import {
  calculateFinancialImpact
} from "./impactCalculator";

export interface BusinessCaseInput {
  metricName: string;

  baseline: number;
  target: number;

  volume: number;
  unitValue: number;

  confidence?: number;
}

export function buildBusinessCase(
  input: BusinessCaseInput
): BusinessCase {
  const impact = calculateFinancialImpact(
    input.baseline,
    input.target,
    input.volume,
    input.unitValue
  );

  return {
    metricName: input.metricName,

    baseline: input.baseline,
    target: input.target,

    gap: impact.gapPercentagePoints,

    gapUnit: "PERCENTAGE_POINTS",

    volume: input.volume,

    estimatedAdditionalVolume:
      impact.estimatedAdditionalVolume,

    unitValue: input.unitValue,

    estimatedMonthlyImpact:
      impact.estimatedFinancialImpact,

    confidence: input.confidence ?? 0.9
  };
}