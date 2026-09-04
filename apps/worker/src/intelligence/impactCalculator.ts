export interface ImpactCalculation {
  gapPercentagePoints: number;
  volume: number;
  estimatedAdditionalVolume: number;
  unitValue: number;
  estimatedFinancialImpact: number;
}

export function calculateFinancialImpact(
  baseline: number,
  target: number,
  volume: number,
  unitValue: number
): ImpactCalculation {
  const gapPercentagePoints = target - baseline;

  const estimatedAdditionalVolume =
    Number(
      ((gapPercentagePoints / 100) * volume).toFixed(2)
    );

  const estimatedFinancialImpact =
    Number(
      (estimatedAdditionalVolume * unitValue).toFixed(2)
    );

  return {
    gapPercentagePoints,
    volume,
    estimatedAdditionalVolume,
    unitValue,
    estimatedFinancialImpact
  };
}