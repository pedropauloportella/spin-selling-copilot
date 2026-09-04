import type { Metric } from "../domain/metric";

export interface CalculatedRate {
  name: string;
  numerator: number;
  denominator: number;
  value: number;
  unit: "PERCENT";
  confidence: number;
}

export function calculateConversionRate(
  numerator: number,
  denominator: number
): CalculatedRate | null {
  if (denominator <= 0) {
    return null;
  }

  return {
    name: "conversion_rate",
    numerator,
    denominator,
    value: Number(((numerator / denominator) * 100).toFixed(2)),
    unit: "PERCENT",
    confidence: 0.95
  };
}