import { Collapsible, Divider, ProgressRing, Section, SectionHeader } from "@m1kapp/kit";
import { won } from "../lib/format";
import type { IncomeCheckDerived, InputMethod } from "../lib/incomeCheck";
import type { IncomeYear } from "../data/incomeStandards";
import { IncomeDistributionRuler } from "./IncomeDistributionRuler";
import { IncomeYearChart } from "./IncomeYearChart";
import { WelfareEligibilityBadges } from "./WelfareEligibilityBadges";

const AVG_ACCENT = "#7c3aed";

interface IncomeCheckResultProps {
  method: InputMethod;
  dual: boolean;
  householdSize: number;
  year: IncomeYear;
  derived: IncomeCheckDerived;
  formulaOpen: boolean;
  onFormulaToggle: () => void;
}

/** 추정 보수월액 + 분포 눈금 + 연도 추이 + 복지 판정 결과 묶음. hasInput일 때만 렌더된다. */
export function IncomeCheckResult({ method, dual, householdSize, year, derived, formulaOpen, onFormulaToggle }: IncomeCheckResultProps) {
  const { wage, capNote, effectiveFee, fee1Num, fee2Num, medianPct, avgPct, rateLabel, ratePct, feeLabel, sigma } = derived;

  return (
    <>
      <Divider spacing="sm" />

      <Section>
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-5 text-center">
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">추정 보수월액</div>
          <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{won(wage)}</div>
          {capNote && (
            <div className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
              국민연금 기준소득월액 {capNote === "max" ? "상한" : "하한"}에 걸려있어요 — 실제 소득은 이보다{" "}
              {capNote === "max" ? "높을" : "낮을"} 수 있어요
            </div>
          )}
        </div>

        <Collapsible title="계산식 보기" open={formulaOpen} onToggle={onFormulaToggle} className="mt-2">
          <div className="space-y-1.5 text-[13px] text-zinc-600 dark:text-zinc-400">
            {dual && (
              <div>
                맞벌이 합산: 큰쪽 {won(Math.max(fee1Num, fee2Num))} + 작은쪽 {won(Math.min(fee1Num, fee2Num))} ÷ 2 ={" "}
                {won(effectiveFee)}
              </div>
            )}
            {method === "wage" ? (
              <div>
                {dual ? "합산 세전 월급" : "직접 입력한 세전 월급"} {won(effectiveFee)} = 추정 보수월액 {won(wage)}
              </div>
            ) : (
              <div>
                {dual ? `합산 ${feeLabel}` : feeLabel} {won(effectiveFee)} ÷ {rateLabel} {ratePct}% = 추정 보수월액{" "}
                {won(wage)}
              </div>
            )}
          </div>
        </Collapsible>

        <div className="mt-4 flex justify-center gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <ProgressRing value={Math.min(medianPct, 100)} max={100} size={88}>
              <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{medianPct}%</span>
            </ProgressRing>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
              {year}년 기준 중위소득 대비
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">복지 급여 판정 기준</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ProgressRing value={Math.min(avgPct, 100)} max={100} size={88} accent={AVG_ACCENT}>
              <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{avgPct}%</span>
            </ProgressRing>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
              {year}년 도시근로자 월평균소득 대비
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">근로자 평균과 비교</span>
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <IncomeDistributionRuler
            pct={medianPct}
            color="var(--kit-accent)"
            referenceLabel="기준중위소득"
            referenceKind="median"
            sigma={sigma}
          />
          <IncomeDistributionRuler
            pct={avgPct}
            color={AVG_ACCENT}
            referenceLabel="도시근로자 월평균소득"
            referenceKind="mean"
            sigma={sigma}
          />
        </div>
        <div className="mt-1.5 text-[9px] text-zinc-400 dark:text-zinc-500">
          * 로그정규분포 모델로 근사 (σ = 실제 평균÷중위소득 비율에서 역산, 임의값 아님)
        </div>
      </Section>

      <Divider spacing="sm" />

      <Section>
        <SectionHeader>{householdSize}인 가구 기준 중위소득 추이</SectionHeader>
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 px-3 pt-3">
          <IncomeYearChart householdSize={householdSize} year={year} wage={wage} />
        </div>
      </Section>

      <Divider spacing="sm" />

      <Section className="pb-4">
        <SectionHeader>복지사업 소득기준 충족 여부</SectionHeader>
        <WelfareEligibilityBadges medianPct={medianPct} avgPct={avgPct} />
      </Section>
    </>
  );
}
