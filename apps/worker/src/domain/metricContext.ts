import type { Metric } from "./metric";

export interface MetricContext {
  name: string;

  baseline?: Metric;
  target?: Metric;
  gap?: Metric;

  volume?: Metric;
  unitValue?: Metric;

  estimatedAdditionalVolume?: number;
  estimatedFinancialImpact?: number;

  confidence: number;
}