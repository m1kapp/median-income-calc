// 국민연금 사업장가입자 데이터 — 국민연금공단(nps.or.kr) 공식 고시 기준,
// 딥리서치로 교차검증 완료(3-0).

// 연금보험료율(전체, 근로자·사업주 각 절반 부담). 2025년까지 9%, 2026년부터
// 매년 0.5%p씩 8년간 인상해 2033년 13% 도달. 정확한 인상 시행월은 미확인이라
// "2026년 현재 유효한 요율"만 사용.
export const 국민연금보험료율_2026 = 9.5;

// 기준소득월액 상하한액, 원/월. 매년 7월 1일 갱신되는 구간.
// 오늘(2026-07-18)은 2026.7.1~2027.6.30 구간에 해당.
export const 기준소득월액_상한 = 6_590_000;
export const 기준소득월액_하한 = 410_000;

export interface PensionWageResult {
  wage: number;
  capped: "min" | "max" | null;
}

/** 국민연금 보험료(본인부담분) → 추정 기준소득월액. 상하한 캡 도달 시 실제 소득은 더 높거나(상한) 낮을(하한) 수 있음을 표시. */
export function pensionFeeToWage(fee: number): PensionWageResult {
  const employeeRate = 국민연금보험료율_2026 / 2 / 100;
  const implied = Math.round(fee / employeeRate);
  if (implied >= 기준소득월액_상한) return { wage: 기준소득월액_상한, capped: "max" };
  if (implied <= 기준소득월액_하한) return { wage: 기준소득월액_하한, capped: "min" };
  return { wage: implied, capped: null };
}

/** 기준중위소득 대비 pct% 지점의 국민연금 보험료(본인부담분) 프리셋 값 — 상하한 캡 적용. */
export function pensionFeeForWage(targetWage: number): number {
  const clamped = Math.min(Math.max(targetWage, 기준소득월액_하한), 기준소득월액_상한);
  return Math.round(clamped * (국민연금보험료율_2026 / 2 / 100));
}
