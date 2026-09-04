import {
  calculateConversionRate
} from "./rateCalculator";

export interface BusinessMetricAnalysis {
  metrics: Array<{
    name: string;
    value: number;
    unit: string;
    sourceText: string;
  }>;
}

export function analyzeBusinessMetrics(
  text: string
): BusinessMetricAnalysis {
  const normalized = text.toLowerCase();

  const numberPattern = /\d+(?:[.,]\d+)?/g;

  const rawNumbers = normalized.match(numberPattern) ?? [];

  const numbers = rawNumbers
    .map((value) => Number(value.replace(",", ".")))
    .filter((value) => !Number.isNaN(value));

  const metrics: BusinessMetricAnalysis["metrics"] = [];

  /*
   * Exemplo:
   * "recebemos 600 leads e apenas 40 viram matrícula"
   */

  if (
    numbers.length >= 2 &&
    normalized.includes("lead") &&
    (
      normalized.includes("matr") ||
      normalized.includes("aluno") ||
      normalized.includes("venda")
    )
  ) {
    const leads = numbers[0];
    const conversions = numbers[1];

    const rate = calculateConversionRate(
      conversions,
      leads
    );

    if (rate) {
      metrics.push({
        name: rate.name,
        value: rate.value,
        unit: rate.unit,
        sourceText: text
      });
    }
  }

  return {
    metrics
  };
}