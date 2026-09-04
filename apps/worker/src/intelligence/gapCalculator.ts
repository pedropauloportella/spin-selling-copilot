import type { Metric } from "../domain/metric";

export function calculatePercentageGap(
  baseline: number,
  target: number
): Metric {
  const gap = Number((target - baseline).toFixed(2));

  return {
    name: "gap",
    value: gap,
    unit: "PERCENT",
    type: "GAP",
    sourceText: `${target}% - ${baseline}%`,
    confidence: 1
  };
}