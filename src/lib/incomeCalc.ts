import { 건강보험료율, 기준중위소득, 도시근로자월평균소득, LATEST_YEAR, type IncomeYear } from "../data/incomeStandards";

export function combineDualIncome(feeA: number, feeB: number): number {
  return feeA > feeB ? feeA + feeB / 2 : feeB + feeA / 2;
}

/** 건강보험료율(%)을 소수 배율로 환산. */
function healthRate(year: IncomeYear): number {
  return 건강보험료율[year] / 100;
}

/** 월급 대비 기준값의 비율(%), 소수 첫째자리 반올림. */
function incomeRatio(wage: number, base: number): number {
  return Math.round((wage / base) * 1000) / 10;
}

export function feeToMonthlyWage(fee: number, year: IncomeYear = LATEST_YEAR): number {
  return Math.round(fee / healthRate(year));
}

export function medianIncomeRatio(wage: number, householdSize: number, year: IncomeYear = LATEST_YEAR): number {
  return incomeRatio(wage, 기준중위소득[year][householdSize - 1]);
}

export function avgWorkerIncomeRatio(wage: number, householdSize: number, year: IncomeYear = LATEST_YEAR): number {
  return incomeRatio(wage, 도시근로자월평균소득[year][householdSize - 1]);
}

export function feeForMedianPercent(pct: number, householdSize: number, year: IncomeYear = LATEST_YEAR): number {
  const base = 기준중위소득[year][householdSize - 1] * healthRate(year);
  return Math.round(base * (pct / 100));
}
