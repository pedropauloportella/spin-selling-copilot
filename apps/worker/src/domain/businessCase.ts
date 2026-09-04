export interface BusinessCase {
  metricName: string;

  baseline: number;
  target: number;

  gap: number;
  gapUnit: "PERCENTAGE_POINTS" | "ABSOLUTE";

  volume: number;

  estimatedAdditionalVolume: number;

  unitValue: number;

  estimatedMonthlyImpact: number;

  confidence: number;
}