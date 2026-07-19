import { useState } from "react";
import { Divider, Field, IconButton, Section, SegmentedControl } from "@m1kapp/kit";
import { Info } from "lucide-react";
import { avgWorkerIncomeRatio, medianIncomeRatio } from "../lib/incomeCalc";
import { lognormalSigma } from "../lib/incomeDistribution";
import { pensionFeeForWage } from "../data/pension";
import { 건강보험료율, 급여기준, 기준중위소득, 도시근로자월평균소득, type IncomeYear } from "../data/incomeStandards";
import { HouseholdSizePicker } from "./HouseholdSizePicker";
import { IncomeConceptInfoDialog } from "./IncomeConceptInfoDialog";
import { IncomeDistributionRuler } from "./IncomeDistributionRuler";

export interface TargetIncomeLookupProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
}

type Basis = "median" | "mean";

const AVG_ACCENT = "#7c3aed";
const BASIS_OPTIONS: { value: Basis; label: string }[] = [
  { value: "median", label: "중위소득" },
  { value: "mean", label: "월평균소득" },
];

const GENERIC_PRESETS = [100, 150, 180].map((value) => ({ display: `${value}%`, value }));
// 급여기준(생계·의료·주거·교육급여)은 기준중위소득 대비로만 정의됨 — 월평균소득 기준일 땐 의미 없음
const MEDIAN_PRESETS = [
  ...Object.entries(급여기준).map(([label, value]) => ({ display: `${label} ${value}%`, value })),
  ...GENERIC_PRESETS,
];

function won(n: number): string {
  return `${Math.round(n).toLocaleString()}원`;
}

export function TargetIncomeLookup({ householdSize, onHouseholdSizeChange, year }: TargetIncomeLookupProps) {
  const [basis, setBasis] = useState<Basis>("median");
  const [infoOpen, setInfoOpen] = useState(false);
  const [pctInput, setPctInput] = useState("100");
  const pct = Math.max(Number(pctInput) || 0, 0);

  const medianBase = 기준중위소득[year][householdSize - 1];
  const meanBase = 도시근로자월평균소득[year][householdSize - 1];
  const sigma = lognormalSigma(medianBase, meanBase);

  const primaryBase = basis === "median" ? medianBase : meanBase;
  const wage = Math.round(primaryBase * (pct / 100));
  const healthFee = Math.round(wage * (건강보험료율[year] / 100));
  const pensionFee = pensionFeeForWage(wage);

  const medianRatio = medianIncomeRatio(wage, householdSize, year);
  const avgRatio = avgWorkerIncomeRatio(wage, householdSize, year);
  const primaryColor = basis === "median" ? "var(--kit-accent)" : AVG_ACCENT;
  const crossColor = basis === "median" ? AVG_ACCENT : "var(--kit-accent)";
  const primaryLabel = basis === "median" ? "기준중위소득" : "도시근로자 월평균소득";
  const crossLabel = basis === "median" ? "도시근로자 월평균소득" : "기준중위소득";
  const crossRatio = basis === "median" ? avgRatio : medianRatio;

  return (
    <>
      <Section className="pt-4">
        <HouseholdSizePicker value={householdSize} onChange={onHouseholdSizeChange} />
      </Section>

      <Divider spacing="sm" />

      <Section>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
            목표 기준
            <IconButton
              icon={<Info size={13} />}
              label="중위소득·월평균소득 설명"
              size="sm"
              variant="ghost"
              onClick={() => setInfoOpen(true)}
              className="!h-4 !w-4 !min-h-0 !p-0 text-zinc-400 dark:text-zinc-500"
            />
          </span>
          <div className="w-[210px]">
            <SegmentedControl options={BASIS_OPTIONS} value={basis} onChange={(v) => setBasis(v as Basis)} />
          </div>
        </div>
        <Field
          label={`${year}년 ${primaryLabel} 대비 %`}
          value={pctInput}
          onChange={setPctInput}
          type="number"
          placeholder="예: 100"
          hint={`${primaryLabel} 100% = ${won(primaryBase)}`}
        />
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {(basis === "median" ? MEDIAN_PRESETS : GENERIC_PRESETS).map((p) => {
            const active = pct === p.value;
            return (
              <button
                key={p.display}
                type="button"
                onClick={() => setPctInput(String(p.value))}
                className={`rounded-full px-2 py-1 text-[11px] font-semibold transition-colors ${
                  active ? "text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
                style={active ? { backgroundColor: primaryColor } : undefined}
              >
                {p.display}
              </button>
            );
          })}
        </div>
      </Section>

      <Divider spacing="sm" />

      <Section className="pb-4">
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-5 text-center">
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">
            {year}년 {primaryLabel} {pct}%에 해당하는 세전 월급
          </div>
          <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{won(wage)}</div>
          <div className="mt-1.5 text-[12px]" style={{ color: crossColor }}>
            {crossLabel} 기준으로는 <span className="font-bold">{crossRatio}%</span>에 해당해요
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <IncomeDistributionRuler
            pct={medianRatio}
            color="var(--kit-accent)"
            referenceLabel="기준중위소득"
            referenceKind="median"
            sigma={sigma}
          />
          <IncomeDistributionRuler pct={avgRatio} color={AVG_ACCENT} referenceLabel="도시근로자 월평균소득" referenceKind="mean" sigma={sigma} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">건강보험료(본인부담) 환산</div>
            <div className="mt-0.5 text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{won(healthFee)}</div>
          </div>
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">국민연금 보험료(본인부담) 환산</div>
            <div className="mt-0.5 text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{won(pensionFee)}</div>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
          보험료 환산은 {year}년 요율 기준 추정치이며, 국민연금은 기준소득월액 상하한 캡이 적용될 수 있어요. 분포
          곡선은 로그정규분포 모델로 근사 (σ = 실제 평균÷중위소득 비율에서 역산).
        </div>
      </Section>

      <IncomeConceptInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
