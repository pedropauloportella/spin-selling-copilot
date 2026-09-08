import type { SpinStage } from "../../domain/spin";
import type { ConversationAnalyzer } from "./analyzer";
import type { ConversationAnalysis } from "./types";

type FetchLike = typeof fetch;

interface OpenAIResponse {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
}

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "detectedStage",
    "stageConfidence",
    "problems",
    "metrics",
    "impacts",
    "facts",
    "hypotheses"
  ],
  properties: {
    detectedStage: {
      type: "string",
      enum: ["SITUATION", "PROBLEM", "IMPLICATION", "NEED_PAYOFF", "CTQ", "BUSINESS_CASE", "OFFER", "CLOSE"]
    },
    stageConfidence: { type: "number", minimum: 0, maximum: 1 },
    problems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["description", "confidence"],
        properties: {
          description: { type: "string" },
          process: { type: "string" },
          confidence: { type: "number", minimum: 0, maximum: 1 }
        }
      }
    },
    metrics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "confidence"],
        properties: {
          name: { type: "string" },
          value: { type: "number" },
          unit: { type: "string" },
          target: { type: "number" },
          confidence: { type: "number", minimum: 0, maximum: 1 }
        }
      }
    },
    impacts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["description", "confidence"],
        properties: {
          description: { type: "string" },
          value: { type: "number" },
          currency: { type: "string" },
          confidence: { type: "number", minimum: 0, maximum: 1 }
        }
      }
    },
    facts: { type: "array", items: { type: "string" } },
    hypotheses: { type: "array", items: { type: "string" } }
  }
} as const;

const INSTRUCTIONS = `Você é um copiloto de engenharia de vendas especializado em SPIN Selling e Lean Six Sigma.
Analise a fala do comprador sem inventar dados. Identifique somente problemas e métricas que tenham evidência na fala.
Use o estágio SPIN informado como contexto, mas avance apenas quando houver evidência. Diferencie fatos de hipóteses.
Retorne estritamente o objeto definido pelo schema.`;

export class OpenAIAnalyzer implements ConversationAnalyzer {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly request: FetchLike = (...args) => fetch(...args)
  ) {}

  async analyze(input: {
    buyerUtterance: string;
    sellerUtterance?: string;
    currentStage: SpinStage;
    sector?: string;
  }): Promise<ConversationAnalysis> {
    const response = await this.request("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        store: false,
        instructions: INSTRUCTIONS,
        input: JSON.stringify(input),
        text: {
          format: {
            type: "json_schema",
            name: "sales_conversation_analysis",
            strict: true,
            schema: ANALYSIS_SCHEMA
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed (${response.status}).`);
    }

    const payload = await response.json() as OpenAIResponse;
    const outputText = payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")
      ?.text;

    if (!outputText) {
      throw new Error("OpenAI response did not contain structured output.");
    }

    return JSON.parse(outputText) as ConversationAnalysis;
  }
}
