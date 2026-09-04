import type { MetricContext } from "../domain/metricContext";
import type { Metric } from "../domain/metric";

import {
  calculatePercentageGap
} from "./gapCalculator";

import {
  calculateFinancialImpact
} from "./impactCalculator";

export interface MetricContextInput {
  name: string;

  baseline?: Metric;
  target?: Metric;

  volume?: Metric;
  unitValue?: Metric;

  confidence?: number;
}

export function buildMetricContext(
  input: MetricContextInput
): MetricContext {
  let gap: Metric | undefined;

  if (
    input.baseline?.unit === "PERCENT" &&
    input.target?.unit === "PERCENT"
  ) {
    gap = calculatePercentageGap(
      input.baseline.value,
      input.target.value
    );
  }

  let estimatedAdditionalVolume: number | undefined;
  let estimatedFinancialImpact: number | undefined;

  if (
    input.baseline?.unit === "PERCENT" &&
    input.target?.unit === "PERCENT" &&
    input.volume &&
    input.unitValue
  ) {
    const impact = calculateFinancialImpact(
      input.baseline.value,
      input.target.value,
      input.volume.value,
      input.unitValue.value
    );

    estimatedAdditionalVolume =
      impact.estimatedAdditionalVolume;

    estimatedFinancialImpact =
      impact.estimatedFinancialImpact;
  }

  return {
    name: input.name,

    baseline: input.baseline,
    target: input.target,
    gap,

    volume: input.volume,
    unitValue: input.unitValue,

    estimatedAdditionalVolume,
    estimatedFinancialImpact,

    confidence: input.confidence ?? 0.9
  };
}