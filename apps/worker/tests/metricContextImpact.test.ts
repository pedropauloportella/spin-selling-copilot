import { describe, expect, it } from "vitest";

import {
  buildMetricContext
} from "../src/intelligence/metricContextBuilder";

describe("metricContext impact", () => {
  it("calculates financial impact when all required data exists", () => {
    const result = buildMetricContext({
      name: "conversion_rate",

      baseline: {
        name: "conversion_rate",
        value: 6.67,
        unit: "PERCENT",
        type: "BASELINE",
        sourceText: "convertemos 6,67%",
        confidence: 0.95
      },

      target: {
        name: "conversion_rate",
        value: 10,
        unit: "PERCENT",
        type: "TARGET",
        sourceText: "queremos chegar a 10%",
        confidence: 0.95
      },

      volume: {
        name: "monthly_leads",
        value: 600,
        unit: "COUNT",
        type: "COUNT",
        sourceText: "600 leads por mês",
        confidence: 0.95
      },

      unitValue: {
        name: "enrollment_value",
        value: 300,
        unit: "CURRENCY",
        type: "COUNT",
        sourceText: "cada matrícula vale R$ 300",
        confidence: 0.95
      }
    });

    expect(result.gap?.value)
      .toBeCloseTo(3.33, 2);

    expect(result.estimatedAdditionalVolume)
      .toBeCloseTo(19.98, 2);

    expect(result.estimatedFinancialImpact)
      .toBeCloseTo(5994, 0);
  });
});