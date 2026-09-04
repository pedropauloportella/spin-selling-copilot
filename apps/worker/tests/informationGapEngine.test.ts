import { describe, expect, it } from "vitest";

import {
  analyzeInformationGaps
} from "../src/intelligence/informationGapEngine";

import {
  decideDiagnosticAction
} from "../src/intelligence/diagnosticDecision";

describe("informationGapEngine", () => {
  it("asks for quantification when there is no metric context", () => {
    const result = analyzeInformationGaps();

    expect(result.nextGap?.type)
      .toBe("PROBLEM_QUANTITY");

    expect(result.nextGap?.suggestedQuestion)
      .toBe("Você consegue quantificar esse problema em números?");
  });

  it("asks for baseline when baseline is missing", () => {
    const result = analyzeInformationGaps({
      name: "conversion_rate",
      confidence: 0.9
    });

    expect(result.nextGap?.type)
      .toBe("BASELINE");
  });

  it("asks for target when baseline exists but target is missing", () => {
    const result = analyzeInformationGaps({
      name: "conversion_rate",
      baseline: {
        name: "conversion_rate",
        value: 6.67,
        unit: "PERCENT",
        type: "BASELINE",
        sourceText: "convertemos 6,67%",
        confidence: 0.95
      },
      confidence: 0.9
    });

    expect(result.nextGap?.type)
      .toBe("TARGET");
  });
});

describe("diagnosticDecision", () => {
  it("returns ASK_QUANTIFICATION without metric context", () => {
    const result = decideDiagnosticAction();

    expect(result.action)
      .toBe("ASK_QUANTIFICATION");
  });

  it("returns ASK_BASELINE when baseline is missing", () => {
    const result = decideDiagnosticAction({
      name: "conversion_rate",
      confidence: 0.9
    });

    expect(result.action)
      .toBe("ASK_BASELINE");
  });
});