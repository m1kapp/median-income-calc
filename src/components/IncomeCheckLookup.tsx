import { useState } from "react";
import { Badge, Collapsible, Divider, Field, IconButton, ProgressRing, Section, SectionHeader, SegmentedControl, Switch } from "@m1kapp/kit";
import { Info, Landmark, Stethoscope, Wallet } from "lucide-react";
import { avgWorkerIncomeRatio, combineDualIncome, feeToMonthlyWage, medianIncomeRatio } from "../lib/incomeCalc";
import { lognormalSigma } from "../lib/incomeDistribution";
import { pensionFeeToWage, 국민연금보험료율_2026 } from "../data/pension";
import { 건강보험료율, 기준중위소득, 도시근로자월평균소득, type IncomeYear } from "../data/incomeStandards";
import { WELFARE_PROGRAMS } from "../data/welfarePrograms";
import { AccuracyInfoDialog } from "./AccuracyInfoDialog";
import { HouseholdSizePicker } from "./HouseholdSizePicker";
import { IncomeDistributionRuler } from "./IncomeDistributionRuler";
import { IncomeYearChart } from "./IncomeYearChart";
import { IncomeHelpSheet } from "./IncomeHelpSheet";
import { PensionHelpSheet } from "./PensionHelpSheet";
import { WageHelpSheet } from "./WageHelpSheet";

export type InputMethod = "health" | "pension" | "wage";

export interface IncomeCheckLookupProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
}

const AVG_ACCENT = "#7c3aed";

const METHOD_OPTIONS: { value: InputMethod; label: string }[] = [
  { value: "health", label: "건보료" },
  { value: "pension", label: "국민연금" },
  { value: "wage", label: "월급" },
];

const METHOD_COPY: Record<
  InputMethod,
  { fieldLabel: string; icon: typeof Stethoscope; placeholder: string; hint: string; spouseLabel: string; helpLabel: string }
> = {
  health: {
    fieldLabel: "월 건강보험료",
    icon: Stethoscope,
    placeholder: "예: 150000",
    hint: "직장가입자 기준, 노인장기요양보험료 미포함",
    spouseLabel: "배우자 건강보험료",
    helpLabel: "확인 방법 보기 (국민건강보험공단)",
  },
  pension: {
    fieldLabel: "월 국민연금 보험료",
    icon: Landmark,
    placeholder: "예: 200000",
    hint: "사업장가입자 본인부담분 기준. 기준소득월액 상하한(41만~659만원)을 벗어나면 실제 소득과 오차 있을 수 있음",
    spouseLabel: "배우자 국민연금 보험료",
    helpLabel: "확인 방법 보기 (국민연금공단)",
  },
  wage: {
    fieldLabel: "세전 월급(월 급여)",
    icon: Wallet,
    placeholder: "예: 3000000",
    hint: "세전 기준, 상여금·성과급 등 비정기 소득 제외",
    spouseLabel: "배우자 세전 월급",
    helpLabel: "세전/세후 헷갈려요 (국세청 홈택스)",
  },
};

function won(n: number): string {
  return `${Math.round(n).toLocaleString()}원`;
}

export function IncomeCheckLookup({ householdSize, onHouseholdSizeChange, year }: IncomeCheckLookupProps) {
  const [method, setMethod] = useState<InputMethod>("health");
  const [fee1, setFee1] = useState("");
  const [fee2, setFee2] = useState("");
  const [dual, setDual] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [accuracyInfoOpen, setAccuracyInfoOpen] = useState(false);

  const copy = METHOD_COPY[method];
  const fee1Num = Number(fee1) || 0;
  const fee2Num = Number(fee2) || 0;
  const hasInput = fee1Num > 0 && (!dual || fee2Num > 0);

  const effectiveFee = dual ? combineDualIncome(fee1Num, fee2Num) : fee1Num;
  const wage =
    method === "health" ? feeToMonthlyWage(effectiveFee, year) : method === "wage" ? effectiveFee : pensionFeeToWage(effectiveFee).wage;
  const capNote = method === "pension" ? pensionFeeToWage(effectiveFee).capped : null;

  const medianPct = hasInput ? medianIncomeRatio(wage, householdSize, year) : 0;
  const avgPct = hasInput ? avgWorkerIncomeRatio(wage, householdSize, year) : 0;

  const rateLabel = method === "health" ? `건강보험료율(${year})` : `국민연금 보험료율(본인부담)`;
  const ratePct = method === "health" ? 건강보험료율[year] : 국민연금보험료율_2026 / 2;
  const feeLabel = method === "health" ? "건강보험료" : method === "pension" ? "국민연금 보험료" : "세전 월급";

  const medianBase = 기준중위소득[year][householdSize - 1];
  const meanBase = 도시근로자월평균소득[year][householdSize - 1];
  const sigma = lognormalSigma(medianBase, meanBase);

  return (
    <>
      <Section className="pt-4">
        <HouseholdSizePicker value={householdSize} onChange={onHouseholdSizeChange} />
      </Section>

      <Divider spacing="sm" />

      <Section>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
            산정 기준
            <IconButton
              icon={<Info size={13} />}
              label="산정 기준별 정확도 설명"
              size="sm"
              variant="ghost"
              onClick={() => setAccuracyInfoOpen(true)}
              className="!h-4 !w-4 !min-h-0 !p-0 text-zinc-400 dark:text-zinc-500"
            />
          </span>
          <div className="w-[246px]">
            <SegmentedControl options={METHOD_OPTIONS} value={method} onChange={(v) => setMethod(v as InputMethod)} />
          </div>
        </div>

        <Field
          label={
            <span className="inline-flex items-center gap-1.5">
              <copy.icon size={13} className="text-zinc-400 dark:text-zinc-500" />
              {copy.fieldLabel}
            </span>
          }
          value={fee1}
          onChange={setFee1}
          type="number"
          placeholder={copy.placeholder}
          hint={copy.hint}
        />
        <button
          onClick={() => setHelpOpen(true)}
          className="mt-1.5 text-[12px] font-medium text-blue-600 dark:text-blue-400"
        >
          {copy.helpLabel} →
        </button>

        {dual && (
          <Field
            label={copy.spouseLabel}
            value={fee2}
            onChange={setFee2}
            type="number"
            placeholder={method === "wage" ? "예: 2500000" : "예: 120000"}
            className="mt-3"
          />
        )}

        {householdSize > 1 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3.5 py-2.5">
            <span className="text-[14px] text-zinc-600 dark:text-zinc-400">
              맞벌이? {dual && <span className="text-zinc-400 dark:text-zinc-500">— 높은소득 + 낮은소득/2</span>}
            </span>
            <Switch checked={dual} onChange={setDual} aria-label="맞벌이" />
          </div>
        )}
      </Section>

      {hasInput && (
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

            <Collapsible
              title="계산식 보기"
              open={formulaOpen}
              onToggle={() => setFormulaOpen((v) => !v)}
              className="mt-2"
            >
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
            <div className="flex flex-wrap gap-1.5">
              {WELFARE_PROGRAMS.map(({ name, cutoff, basis }) => {
                const pct = basis === "median" ? medianPct : avgPct;
                const met = pct <= cutoff;
                return (
                  <Badge key={name} variant={met ? "green" : "red"}>
                    {name} {cutoff}% {met ? "충족" : "미충족"}
                  </Badge>
                );
              })}
            </div>
            {WELFARE_PROGRAMS.some((p) => p.note) && (
              <ul className="mt-2.5 space-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                {WELFARE_PROGRAMS.filter((p) => p.note).map((p) => (
                  <li key={p.name}>
                    · {p.name}: {p.note}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
              소득 기준 충족 = 신청 자격이지 자동 지급이 아니에요. 정확한 요건·지원금은 복지로(bokjiro.go.kr)나
              주민센터에서 확인하세요.
            </div>
          </Section>
        </>
      )}

      {method === "wage" && <WageHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />}
      {method === "health" && <IncomeHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />}
      {method === "pension" && <PensionHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />}

      <AccuracyInfoDialog open={accuracyInfoOpen} onClose={() => setAccuracyInfoOpen(false)} />
    </>
  );
}
