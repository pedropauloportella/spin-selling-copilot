export type InformationGapType =
  | "PROBLEM_QUANTITY"
  | "BASELINE"
  | "TARGET"
  | "VOLUME"
  | "UNIT_VALUE"
  | "ROOT_CAUSE"
  | "NEED_PAYOFF";

export type InformationGapPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface InformationGap {
  type: InformationGapType;
  description: string;
  priority: InformationGapPriority;
  resolved: boolean;
  suggestedQuestion?: string;
}