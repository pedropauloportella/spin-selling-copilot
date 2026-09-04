import type { Metric, MetricUnit } from "../domain/metric";

export interface QuantitativeAnalysis {
  metrics: Metric[];
}

function normalizeNumber(value: string): number {
  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

function detectUnit(text: string): MetricUnit {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("%") ||
    normalized.includes("por cento")
  ) {
    return "PERCENT";
  }

  if (
    normalized.includes("r$") ||
    normalized.includes("reais")
  ) {
    return "CURRENCY";
  }

  if (
    normalized.includes("minuto") ||
    normalized.includes("minutos") ||
    normalized.includes("hora") ||
    normalized.includes("horas")
  ) {
    return "TIME";
  }

  return "COUNT";
}

export function analyzeQuantitativeData(
  text: string
): QuantitativeAnalysis {
  const metrics: Metric[] = [];

  const numberPattern =
    /(?:R\$\s*)?\d+(?:[.,]\d+)?(?:\s*%|\s+por\s+cento)?/gi;

  const matches = text.match(numberPattern) ?? [];

  for (const match of matches) {
    const numericPart = match
      .replace(/R\$/gi, "")
      .replace(/%/g, "")
      .replace(/por\s+cento/gi, "")
      .trim();

    const value = normalizeNumber(numericPart);

    if (Number.isNaN(value)) {
      continue;
    }

    metrics.push({
      name: "unknown",
      value,
      unit: detectUnit(match),
      type: "UNKNOWN",
      sourceText: match,
      confidence: 0.8
    });
  }

  return {
    metrics
  };
}