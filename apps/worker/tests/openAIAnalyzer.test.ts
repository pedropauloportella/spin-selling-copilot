import { describe, expect, it, vi } from "vitest";
import { OpenAIAnalyzer } from "../src/infrastructure/ai/openAIAnalyzer";

describe("OpenAIAnalyzer", () => {
  it("sends a structured-output request and parses the analysis", async () => {
    const analysis = {
      detectedStage: "PROBLEM",
      stageConfidence: 0.91,
      problems: [{ description: "Baixa conversão de leads", confidence: 0.9 }],
      metrics: [],
      impacts: [],
      facts: ["O comprador relata poucos fechamentos."],
      hypotheses: []
    };
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        output: [{ content: [{ type: "output_text", text: JSON.stringify(analysis) }] }]
      }), { status: 200 })
    );
    const analyzer = new OpenAIAnalyzer("test-key", "test-model", request);

    const result = await analyzer.analyze({
      buyerUtterance: "Poucos leads viram matrícula.",
      currentStage: "SITUATION"
    });

    expect(result).toEqual(analysis);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/responses");
    expect(JSON.parse(options.body).text.format.type).toBe("json_schema");
  });
});
