import type {
  SalesContext
} from "../domain/salesContext";

export function nextBestAction(
  context: SalesContext
) {

  const topGap =
    context.informationGaps[0];

  if (!topGap) {

    return {
      type: "SUMMARIZE" as const,

      text:
        "Pelo que entendi, já identificamos o problema e os indicadores principais. Posso resumir a oportunidade para confirmar se estamos alinhados?",

      reason:
        "Não existem lacunas críticas de informação."
    };
  }

  if (
    topGap.field === "problems"
  ) {

    return {
      type: "QUESTION" as const,

      text:
        "Qual é hoje o principal problema ou gargalo que mais impede a empresa de crescer?",

      reason:
        topGap.reason
    };
  }

  if (
    topGap.field.includes(
      ".confirmation"
    )
  ) {

    return {
      type: "QUESTION" as const,

      text:
        "Esse problema é algo que realmente preocupa você hoje ou é apenas algo pontual?",

      reason:
        topGap.reason
    };
  }

  if (
    topGap.field.includes(
      ".measurement"
    )
  ) {

    return {
      type: "QUESTION" as const,

      text:
        "Você consegue estimar com que frequência isso acontece ou qual é a dimensão desse problema hoje?",

      reason:
        topGap.reason
    };
  }

  if (
    topGap.field.includes(
      ".baseline"
    )
  ) {

    const ctq =
      context.ctqs.find(
        item =>
          topGap.field.includes(item.id)
      );

    return {
      type: "QUESTION" as const,

      text:
        `Vocês sabem qual é o valor atual de "${ctq?.name}"?`,

      reason:
        topGap.reason
    };
  }

  if (
    topGap.field.includes(
      ".target"
    )
  ) {

    const ctq =
      context.ctqs.find(
        item =>
          topGap.field.includes(item.id)
      );

    return {
      type: "QUESTION" as const,

      text:
        `Qual seria um resultado considerado ideal ou aceitável para "${ctq?.name}"?`,

      reason:
        topGap.reason
    };
  }

  return {
    type: "QUESTION" as const,

    text:
      "Pode me explicar um pouco mais sobre isso?",

    reason:
      "Exploração adicional necessária."
  };
}