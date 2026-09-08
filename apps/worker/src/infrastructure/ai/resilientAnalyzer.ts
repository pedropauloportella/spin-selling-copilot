import type { ConversationAnalyzer } from "./analyzer";
import type { ConversationAnalysis } from "./types";

export class ResilientAnalyzer implements ConversationAnalyzer {
  constructor(
    private readonly primary: ConversationAnalyzer,
    private readonly fallback: ConversationAnalyzer
  ) {}

  async analyze(input: Parameters<ConversationAnalyzer["analyze"]>[0]): Promise<ConversationAnalysis> {
    try {
      return await this.primary.analyze(input);
    } catch (error) {
      console.warn("OpenAI analysis failed; using deterministic fallback.", error);
      return this.fallback.analyze(input);
    }
  }
}
