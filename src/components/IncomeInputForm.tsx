import { useState } from "react";
import { Button, Divider, Field, Section, SectionHeader, SegmentedControl, Switch } from "@m1kapp/kit";
import { feeForMedianPercent } from "../lib/incomeCalc";
import { IncomeHelpSheet } from "./IncomeHelpSheet";

export interface IncomeInputFormProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  fee1: string;
  onFee1Change: (v: string) => void;
  fee2: string;
  onFee2Change: (v: string) => void;
  dual: boolean;
  onDualChange: (v: boolean) => void;
  onCalculate: () => void;
}

const HOUSEHOLD_OPTIONS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ value: String(n), label: n }));
const PRESETS = [100, 150, 180];

export function IncomeInputForm({
  householdSize,
  onHouseholdSizeChange,
  fee1,
  onFee1Change,
  fee2,
  onFee2Change,
  dual,
  onDualChange,
  onCalculate,
}: IncomeInputFormProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <Section className="pt-4">
        <SectionHeader>가족구성원</SectionHeader>
        <SegmentedControl
          options={HOUSEHOLD_OPTIONS}
          value={String(householdSize)}
          onChange={(v) => onHouseholdSizeChange(Number(v))}
        />
      </Section>

      <Divider spacing="sm" />

      <Section>
        <SectionHeader>건강보험료</SectionHeader>
        <Field
          label="월 건강보험료"
          value={fee1}
          onChange={onFee1Change}
          type="number"
          placeholder="예: 150000"
          hint="직장가입자 기준, 노인장기요양보험료 미포함"
        />
        <button
          onClick={() => setHelpOpen(true)}
          className="mt-1.5 text-[12px] font-medium text-blue-600 dark:text-blue-400"
        >
          확인 방법 보기 →
        </button>

        {dual && (
          <Field
            label="배우자 건강보험료"
            value={fee2}
            onChange={onFee2Change}
            type="number"
            placeholder="예: 120000"
            className="mt-3"
          />
        )}

        {householdSize > 1 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3.5 py-2.5">
            <span className="text-[14px] text-zinc-600 dark:text-zinc-400">
              맞벌이? {dual && <span className="text-zinc-400 dark:text-zinc-500">— 높은소득 + 낮은소득/2</span>}
            </span>
            <Switch checked={dual} onChange={onDualChange} aria-label="맞벌이" />
          </div>
        )}
      </Section>

      <Divider spacing="sm" />

      <Section className="pb-4 flex flex-col gap-3">
        {!dual && (
          <div className="flex gap-2">
            {PRESETS.map((pct) => (
              <Button
                key={pct}
                variant="light"
                full
                className="!px-2 !py-1.5 text-[13px]"
                onClick={() => onFee1Change(String(feeForMedianPercent(pct, householdSize)))}
              >
                #중위소득{pct}
              </Button>
            ))}
          </div>
        )}

        <Button variant="dark" full onClick={onCalculate}>
          계산하기
        </Button>
      </Section>

      <IncomeHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
