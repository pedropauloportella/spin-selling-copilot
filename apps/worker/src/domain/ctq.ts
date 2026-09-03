import type { Evidence } from "./evidence";

export type CTQStatus =
  | "CANDIDATE"
  | "DEFINED"
  | "QUANTIFIED"
  | "VALIDATED";

export type CTQDirection =
  | "HIGHER_IS_BETTER"
  | "LOWER_IS_BETTER"
  | "TARGET_IS_BEST";

export interface CTQ {
  id: string;

  name: string;

  metric: string;

  unit?: string;

  direction: CTQDirection;

  baseline?: number;

  target?: number;

  specification?: string;

  status: CTQStatus;

  evidence: Evidence[];

  confidence: number;
}