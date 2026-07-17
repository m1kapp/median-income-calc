import { useState } from "react";
import { AppShell, AppShellHeader, AppShellContent, ToastProvider, useToast, Watermark } from "@m1kapp/kit";
import { IncomeInputForm } from "./components/IncomeInputForm";
import { IncomeResult } from "./components/IncomeResult";
import { avgWorkerIncomeRatio, combineDualIncome, feeToMonthlyWage, medianIncomeRatio } from "./lib/incomeCalc";

const ACCENT = "#2563eb";
// npx m1kkit track https://income.m1k.app 로 발급받은 slug (Vite라 NEXT_PUBLIC_M1K_SLUG env는 안 먹음 — 직접 prop으로)
const TRACK_SLUG = "gu";

interface Result {
  wage: number;
  medianPct: number;
  avgPct: number;
}

function Calculator() {
  return (
    <Watermark color={ACCENT} text="calc" trackSlug={TRACK_SLUG}>
      <CalculatorShell />
    </Watermark>
  );
}

function CalculatorShell() {
  const toast = useToast();
  const [householdSize, setHouseholdSize] = useState(1);
  const [fee1, setFee1] = useState("");
  const [fee2, setFee2] = useState("");
  const [dual, setDual] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate() {
    const fee1Num = Number(fee1);
    const fee2Num = Number(fee2);

    if (!fee1 || isNaN(fee1Num) || fee1Num < 10000 || fee1Num > 1_000_000) {
      toast("비정상적인 건강보험료 금액입니다!", { variant: "error" });
      return;
    }
    if (dual && (!fee2 || isNaN(fee2Num) || fee2Num < 10000 || fee2Num > 1_000_000)) {
      toast("비정상적인 배우자 건강보험료 금액입니다!", { variant: "error" });
      return;
    }

    const combined = dual ? combineDualIncome(fee1Num, fee2Num) : fee1Num;
    const wage = feeToMonthlyWage(combined);

    setResult({
      wage,
      medianPct: medianIncomeRatio(combined, householdSize),
      avgPct: avgWorkerIncomeRatio(wage, householdSize),
    });
  }

  return (
    <AppShell accent={ACCENT}>
      <AppShellHeader>
        <span className="text-lg font-black text-zinc-900 tracking-tight">
          중위소득 · 월평균소득 계산기
        </span>
      </AppShellHeader>
      <AppShellContent>
        {result ? (
          <IncomeResult {...result} onBack={() => setResult(null)} />
        ) : (
          <IncomeInputForm
            householdSize={householdSize}
            onHouseholdSizeChange={setHouseholdSize}
            fee1={fee1}
            onFee1Change={setFee1}
            fee2={fee2}
            onFee2Change={setFee2}
            dual={dual}
            onDualChange={setDual}
            onCalculate={handleCalculate}
          />
        )}
      </AppShellContent>
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Calculator />
    </ToastProvider>
  );
}
