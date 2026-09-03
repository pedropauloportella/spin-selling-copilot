export type EvidenceType =
  | "CUSTOMER_STATEMENT"
  | "MEASURED_DATA"
  | "SYSTEM_DATA"
  | "SELLER_OBSERVATION"
  | "AI_INFERENCE"
  | "ESTIMATE";

export interface Evidence {
  id: string;
  type: EvidenceType;

  text: string;

  sourceSpeaker: "BUYER" | "SELLER" | "SYSTEM";

  timestamp: string;

  confidence: number;
}