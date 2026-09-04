import { describe, expect, it } from "vitest";

import {
  analyzeQuantitativeData
} from "../src/intelligence/quantitativeAnalyzer";

import {
  analyzeBusinessMetrics
} from "../src/intelligence/businessMetrics";

describe("quantitativeAnalyzer", () => {
  it("extracts numbers from conversation", () => {
    const result = analyzeQuantitativeData(
      "Recebemos 600 leads por mês."
    );

    expect(result.metrics.length).toBeGreaterThan(0);
    expect(result.metrics[0].value).toBe(600);
  });
});

describe("businessMetrics", () => {
  it("calculates conversion rate", () => {
    const result = analyzeBusinessMetrics(
      "Recebemos 600 leads por mês e apenas 40 viram matrícula."
    );

    expect(result.metrics.length).toBe(1);

    expect(result.metrics[0].name)
      .toBe("conversion_rate");

    expect(result.metrics[0].value)
      .toBe(6.67);
  });
});