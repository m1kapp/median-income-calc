import { useState } from "react";
import { Divider, Field, IconButton, Section, SegmentedControl, Switch } from "@m1kapp/kit";
import { Info, Landmark, Stethoscope, Wallet } from "lucide-react";
import { deriveIncomeCheck, type InputMethod } from "../lib/incomeCheck";
import { type IncomeYear } from "../data/incomeStandards";
import { AccuracyInfoDialog } from "./AccuracyInfoDialog";
import { HouseholdSizePicker } from "./HouseholdSizePicker";
import { IncomeCheckResult } from "./IncomeCheckResult";
import { MethodHelpSheet } from "./MethodHelpSheet";

export type { InputMethod };

export interface IncomeCheckLookupProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
}

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

export function IncomeCheckLookup({ householdSize, onHouseholdSizeChange, year }: IncomeCheckLookupProps) {
  const [method, setMethod] = useState<InputMethod>("health");
  const [fee1, setFee1] = useState("");
  const [fee2, setFee2] = useState("");
  const [dual, setDual] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [accuracyInfoOpen, setAccuracyInfoOpen] = useState(false);

  const copy = METHOD_COPY[method];
  const derived = deriveIncomeCheck(method, fee1, fee2, dual, householdSize, year);

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

      {derived.hasInput && (
        <IncomeCheckResult
          method={method}
          dual={dual}
          householdSize={householdSize}
          year={year}
          derived={derived}
          formulaOpen={formulaOpen}
          onFormulaToggle={() => setFormulaOpen((v) => !v)}
        />
      )}

      <MethodHelpSheet method={method} open={helpOpen} onClose={() => setHelpOpen(false)} />

      <AccuracyInfoDialog open={accuracyInfoOpen} onClose={() => setAccuracyInfoOpen(false)} />
    </>
  );
}
