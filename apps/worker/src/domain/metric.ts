export type MetricUnit =
  | "COUNT"
  | "PERCENT"
  | "CURRENCY"
  | "TIME"
  | "RATE"
  | "UNKNOWN";

export type MetricType =
  | "BASELINE"
  | "TARGET"
  | "GAP"
  | "COUNT"
  | "RATE"
  | "UNKNOWN";

export interface Metric {
  name: string;
  value: number;
  unit: MetricUnit;
  type: MetricType;
  sourceText: string;
  confidence: number;
}