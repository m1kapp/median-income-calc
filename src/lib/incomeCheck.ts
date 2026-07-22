import { avgWorkerIncomeRatio, combineDualIncome, feeToMonthlyWage, medianIncomeRatio } from "./incomeCalc";
import { lognormalSigma } from "./incomeDistribution";
import { pensionFeeToWage, 국민연금보험료율_2026 } from "../data/pension";
import { 건강보험료율, 기준중위소득, 도시근로자월평균소득, type IncomeYear } from "../data/incomeStandards";

export type InputMethod = "health" | "pension" | "wage";

export interface IncomeCheckDerived {
  fee1Num: number;
  fee2Num: number;
  effectiveFee: number;
  wage: number;
  capNote: "min" | "max" | null;
  hasInput: boolean;
  medianPct: number;
  avgPct: number;
  rateLabel: string;
  ratePct: number;
  feeLabel: string;
  sigma: number;
}

const FEE_LABEL: Record<InputMethod, string> = {
  health: "건강보험료",
  pension: "국민연금 보험료",
  wage: "세전 월급",
};

/** 산정 기준별 보험료/월급 → 추정 보수월액. 상하한 캡 여부도 함께 반환. */
function estimateWage(method: InputMethod, fee: number, year: IncomeYear): { wage: number; capNote: "min" | "max" | null } {
  if (method === "health") return { wage: feeToMonthlyWage(fee, year), capNote: null };
  if (method === "wage") return { wage: fee, capNote: null };
  const { wage, capped } = pensionFeeToWage(fee);
  return { wage, capNote: capped };
}

/** 입력값 문자열에서 화면에 필요한 파생값을 한 번에 계산 — 순수 함수. */
export function deriveIncomeCheck(
  method: InputMethod,
  fee1: string,
  fee2: string,
  dual: boolean,
  householdSize: number,
  year: IncomeYear,
): IncomeCheckDerived {
  const fee1Num = Number(fee1) || 0;
  const fee2Num = Number(fee2) || 0;
  const hasInput = fee1Num > 0 && (!dual || fee2Num > 0);
  const effectiveFee = dual ? combineDualIncome(fee1Num, fee2Num) : fee1Num;

  const { wage, capNote } = estimateWage(method, effectiveFee, year);
  const medianPct = hasInput ? medianIncomeRatio(wage, householdSize, year) : 0;
  const avgPct = hasInput ? avgWorkerIncomeRatio(wage, householdSize, year) : 0;

  const medianBase = 기준중위소득[year][householdSize - 1];
  const meanBase = 도시근로자월평균소득[year][householdSize - 1];

  return {
    fee1Num,
    fee2Num,
    effectiveFee,
    wage,
    capNote,
    hasInput,
    medianPct,
    avgPct,
    rateLabel: method === "health" ? `건강보험료율(${year})` : "국민연금 보험료율(본인부담)",
    ratePct: method === "health" ? 건강보험료율[year] : 국민연금보험료율_2026 / 2,
    feeLabel: FEE_LABEL[method],
    sigma: lognormalSigma(medianBase, meanBase),
  };
}
