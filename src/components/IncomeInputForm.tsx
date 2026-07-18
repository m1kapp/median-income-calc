import { useState } from "react";
import { Button, Divider, Field, Section, SectionHeader, SegmentedControl, Switch } from "@m1kapp/kit";
import { feeForMedianPercent } from "../lib/incomeCalc";
import { YEARS, type IncomeYear } from "../data/incomeStandards";
import { IncomeHelpSheet } from "./IncomeHelpSheet";

export interface IncomeInputFormProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
  onYearChange: (year: IncomeYear) => void;
  fee1: string;
  onFee1Change: (v: string) => void;
  fee2: string;
  onFee2Change: (v: string) => void;
  dual: boolean;
  onDualChange: (v: boolean) => void;
  onCalculate: () => void;
}

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7];
const YEAR_OPTIONS = YEARS.map((y) => ({ value: String(y), label: `'${String(y).slice(2)}` }));
const PRESETS = [100, 150, 180];

export function IncomeInputForm({
  householdSize,
  onHouseholdSizeChange,
  year,
  onYearChange,
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
        <div className="flex items-center justify-between -mt-0.5 mb-2">
          <SectionHeader>가족구성원</SectionHeader>
          <div className="w-[128px] -mt-3">
            <SegmentedControl
              options={YEAR_OPTIONS}
              value={String(year)}
              onChange={(v) => onYearChange(Number(v) as IncomeYear)}
            />
          </div>
        </div>

        <div className="flex justify-between gap-1">
          {HOUSEHOLD_SIZES.map((n) => {
            const active = n === householdSize;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                aria-label={`${n}인 가구`}
                onClick={() => onHouseholdSizeChange(n)}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-[17px] font-black transition-all duration-150 ${
                    active
                      ? "text-white shadow-md scale-110"
                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                  }`}
                  style={active ? { backgroundColor: "var(--kit-accent)" } : undefined}
                >
                  {n}
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  인
                </span>
              </button>
            );
          })}
        </div>
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
                onClick={() => onFee1Change(String(feeForMedianPercent(pct, householdSize, year)))}
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
