import { describe, expect, it } from "vitest";

import {
  calculateFinancialImpact
} from "../src/intelligence/impactCalculator";

import {
  buildBusinessCase
} from "../src/intelligence/businessCaseBuilder";

describe("impactCalculator", () => {
  it("calculates financial impact from conversion gap", () => {
    const result = calculateFinancialImpact(
      6.67,
      10,
      600,
      300
    );

    expect(result.gapPercentagePoints)
      .toBeCloseTo(3.33, 2);

    expect(result.estimatedAdditionalVolume)
      .toBeCloseTo(19.98, 2);

    expect(result.estimatedFinancialImpact)
      .toBeCloseTo(5994, 0);
  });
});

describe("businessCaseBuilder", () => {
  it("builds a business case", () => {
    const result = buildBusinessCase({
      metricName: "conversion_rate",
      baseline: 6.67,
      target: 10,
      volume: 600,
      unitValue: 300
    });

    expect(result.metricName)
      .toBe("conversion_rate");

    expect(result.baseline)
      .toBe(6.67);

    expect(result.target)
      .toBe(10);

    expect(result.gap)
      .toBeCloseTo(3.33, 2);

    expect(result.estimatedMonthlyImpact)
      .toBeCloseTo(5994, 0);
  });
});




import {
  buildMetricContext
} from "../src/intelligence/metricContextBuilder";

describe("metricContextBuilder", () => {
  it("calculates the gap between baseline and target", () => {
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
      }
    });

    expect(result.gap).toBeDefined();

    expect(result.gap?.value)
      .toBeCloseTo(3.33, 2);
  });
});