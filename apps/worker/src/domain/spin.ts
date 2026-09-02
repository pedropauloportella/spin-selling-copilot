export type SpinStage =
  | "SITUATION"
  | "PROBLEM"
  | "IMPLICATION"
  | "NEED_PAYOFF"
  | "CTQ"
  | "BUSINESS_CASE"
  | "OFFER"
  | "CLOSE";

export interface SpinState {
  current: SpinStage;
  completed: SpinStage[];
}

export const SPIN_ORDER: SpinStage[] = [
  "SITUATION",
  "PROBLEM",
  "IMPLICATION",
  "NEED_PAYOFF",
  "CTQ",
  "BUSINESS_CASE",
  "OFFER",
  "CLOSE"
];

export function nextStage(state: SpinState): SpinStage {
  const index = SPIN_ORDER.indexOf(state.current);
  return SPIN_ORDER[Math.min(index + 1, SPIN_ORDER.length - 1)];
}
