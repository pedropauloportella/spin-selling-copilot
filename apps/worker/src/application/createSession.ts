import type { SpinStage } from "../domain/spin";

export function createSession(input: Record<string, unknown>) {
  const sessionId = crypto.randomUUID();

  return {
    sessionId,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    spin: {
      stage: "SITUATION" as SpinStage,
      confidence: 1
    },
    buyer: input.buyer ?? {},
    company: input.company ?? {}
  };
}
