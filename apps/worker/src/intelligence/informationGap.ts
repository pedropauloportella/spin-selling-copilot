import type {
  InformationGap,
  SalesContext
} from "../domain/salesContext";

export function detectInformationGaps(
  context: SalesContext
): InformationGap[] {

  const gaps: InformationGap[] = [];

  if (!context.company?.sector) {
    gaps.push({
      field: "company.sector",

      reason:
        "O setor é necessário para selecionar benchmarks e CTQs relevantes.",

      priority: 10
    });
  }

  if (context.problems.length === 0) {
    gaps.push({
      field: "problems",

      reason:
        "Nenhum problema foi claramente identificado.",

      priority: 9
    });
  }

  for (const problem of context.problems) {

    if (problem.status === "CANDIDATE") {

      gaps.push({
        field: `problem.${problem.id}.confirmation`,

        reason:
          `Confirmar se o problema "${problem.description}" é relevante.`,

        priority: 8
      });
    }

    if (problem.status !== "QUANTIFIED") {

      gaps.push({
        field: `problem.${problem.id}.measurement`,

        reason:
          "O problema precisa ser quantificado.",

        priority: 9
      });
    }
  }

  for (const ctq of context.ctqs) {

    if (ctq.baseline === undefined) {

      gaps.push({
        field: `ctq.${ctq.id}.baseline`,

        reason:
          `Obter o valor atual do CTQ "${ctq.name}".`,

        priority: 10
      });
    }

    if (ctq.target === undefined) {

      gaps.push({
        field: `ctq.${ctq.id}.target`,

        reason:
          `Definir a meta para "${ctq.name}".`,

        priority: 8
      });
    }
  }

  return gaps.sort(
    (a, b) =>
      b.priority - a.priority
  );
}