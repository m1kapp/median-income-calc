import { 건강보험료율, 기준중위소득, 도시근로자월평균소득, LATEST_YEAR, type IncomeYear } from "../data/incomeStandards";

export function combineDualIncome(feeA: number, feeB: number): number {
  return feeA > feeB ? feeA + feeB / 2 : feeB + feeA / 2;
}

export function feeToMonthlyWage(fee: number): number {
  return Math.round(fee / (건강보험료율 / 100));
}

export function medianIncomeRatio(fee: number, householdSize: number, year: IncomeYear = LATEST_YEAR): number {
  const base = 기준중위소득[year][householdSize - 1] * (건강보험료율 / 100);
  return Math.round((fee / base) * 1000) / 10;
}

export function avgWorkerIncomeRatio(wage: number, householdSize: number): number {
  const base = 도시근로자월평균소득[householdSize - 1];
  return Math.round((wage / base) * 1000) / 10;
}

export function feeForMedianPercent(pct: number, householdSize: number, year: IncomeYear = LATEST_YEAR): number {
  const base = 기준중위소득[year][householdSize - 1] * (건강보험료율 / 100);
  return Math.round(base * (pct / 100));
}
