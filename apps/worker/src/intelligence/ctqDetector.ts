import type { Problem } from "../domain/problem";
import type { CTQ } from "../domain/ctq";

interface CTQMapping {
  keywords: string[];

  ctq: {
    name: string;

    metric: string;

    unit: string;

    direction: CTQ["direction"];
  };
}

const CTQ_MAPPINGS: CTQMapping[] = [

  {
    keywords: [
      "conversão",
      "lead",
      "matrícula",
      "fechamento"
    ],

    ctq: {
      name: "Taxa de conversão de leads",

      metric: "lead_conversion_rate",

      unit: "%",

      direction: "HIGHER_IS_BETTER"
    }
  },

  {
    keywords: [
      "perdendo clientes",
      "cancelamento",
      "churn",
      "evasão"
    ],

    ctq: {
      name: "Taxa de retenção de clientes",

      metric: "customer_retention_rate",

      unit: "%",

      direction: "HIGHER_IS_BETTER"
    }
  },

  {
    keywords: [
      "demora",
      "responder",
      "tempo"
    ],

    ctq: {
      name: "Tempo de primeira resposta",

      metric: "first_response_time",

      unit: "minutos",

      direction: "LOWER_IS_BETTER"
    }
  }
];

export function detectCTQs(
  problems: Problem[]
): CTQ[] {

  const results: CTQ[] = [];

  for (const problem of problems) {

    const text =
      `${problem.description} ${problem.process ?? ""}`
        .toLowerCase();

    for (const mapping of CTQ_MAPPINGS) {

      const matches =
        mapping.keywords.filter(
          keyword => text.includes(keyword)
        );

      if (matches.length === 0) {
        continue;
      }

      results.push({
        id: crypto.randomUUID(),

        name: mapping.ctq.name,

        metric: mapping.ctq.metric,

        unit: mapping.ctq.unit,

        direction: mapping.ctq.direction,

        status: "CANDIDATE",

        evidence: problem.evidence,

        confidence:
          Math.min(
            problem.confidence +
            matches.length * 0.03,
            0.98
          )
      });
    }
  }

  return removeDuplicateCTQs(results);
}

function removeDuplicateCTQs(
  ctqs: CTQ[]
): CTQ[] {

  const unique = new Map<string, CTQ>();

  for (const ctq of ctqs) {

    const existing =
      unique.get(ctq.metric);

    if (
      !existing ||
      ctq.confidence > existing.confidence
    ) {
      unique.set(ctq.metric, ctq);
    }
  }

  return Array.from(unique.values());
}