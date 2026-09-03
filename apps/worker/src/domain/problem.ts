import type { Evidence } from "./evidence";

export type ProblemStatus =
  | "CANDIDATE"
  | "CONFIRMED"
  | "QUANTIFIED";

export interface Problem {
  id: string;

  description: string;

  process?: string;

  status: ProblemStatus;

  frequency?: number;

  frequencyUnit?: string;

  severity?: number;

  evidence: Evidence[];

  confidence: number;
}