import type { SalesContext } from "../domain/salesContext";

export interface CreateSessionInput {
  sellerId?: string;
  buyer?: { name?: string; role?: string };
  company?: { name?: string; sector?: string; size?: string };
  recordingConsent: boolean;
  retentionDays?: number;
}

export function createSession(input: CreateSessionInput) {
  const sessionId = crypto.randomUUID();

  const context: SalesContext = {
    sessionId,
    sellerId: input.sellerId,
    buyer: input.buyer ?? {},
    company: input.company ?? {},
    spin: { stage: "SITUATION", confidence: 1 },
    conversation: {},
    evidence: [],
    problems: [],
    ctqs: [],
    impacts: [],
    informationGaps: []
  };

  return {
    sessionId,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    recordingConsent: input.recordingConsent,
    retentionDays: input.retentionDays ?? 90,
    context
  };
}
