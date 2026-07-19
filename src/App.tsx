import { useState } from "react";
import { AppShell, AppShellHeader, AppShellContent, SegmentedControl, Select, Tab, TabBar, ToastProvider, Watermark } from "@m1kapp/kit";
import { BookOpen, Calculator as CalculatorIcon } from "lucide-react";
import { IncomeCheckLookup } from "./components/IncomeCheckLookup";
import { SystemInfoPage } from "./components/SystemInfoPage";
import { TargetIncomeLookup } from "./components/TargetIncomeLookup";
import { LATEST_YEAR, YEARS, type IncomeYear } from "./data/incomeStandards";

const ACCENT = "#2563eb";
// npx m1kkit track https://income.m1k.app 로 발급받은 slug (Vite라 NEXT_PUBLIC_M1K_SLUG env는 안 먹음 — 직접 prop으로)
const TRACK_SLUG = "gu";

type AppSection = "calc" | "info";
type AppMode = "check" | "target";
const MODE_OPTIONS: { value: AppMode; label: string }[] = [
  { value: "target", label: "몇%가 얼마?" },
  { value: "check", label: "내 월급 몇%?" },
];
const YEAR_SELECT_OPTIONS = YEARS.map((y) => ({ value: y as IncomeYear, label: `${y}년` }));

function Calculator() {
  return (
    <Watermark color={ACCENT} text="calc" trackSlug={TRACK_SLUG}>
      <CalculatorShell />
    </Watermark>
  );
}

function CalculatorShell() {
  const [section, setSection] = useState<AppSection>("calc");
  const [mode, setMode] = useState<AppMode>("target");
  const [householdSize, setHouseholdSize] = useState(1);
  const [year, setYear] = useState<IncomeYear>(LATEST_YEAR);

  return (
    <AppShell accent={ACCENT}>
      <AppShellHeader>
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-black text-zinc-900 tracking-tight">
            중위소득 · 월평균소득 계산기
          </span>
          <div className="w-[78px]">
            <Select
              options={YEAR_SELECT_OPTIONS}
              value={year}
              onChange={(v) => v && setYear(v)}
              allowClear={false}
              className="year-select-compact"
            />
          </div>
        </div>
      </AppShellHeader>
      <AppShellContent>
        {section === "calc" ? (
          <>
            <div className="px-4 pt-3">
              <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={(v) => setMode(v as AppMode)} />
            </div>

            {mode === "target" ? (
              <TargetIncomeLookup householdSize={householdSize} onHouseholdSizeChange={setHouseholdSize} year={year} />
            ) : (
              <IncomeCheckLookup householdSize={householdSize} onHouseholdSizeChange={setHouseholdSize} year={year} />
            )}
          </>
        ) : (
          <SystemInfoPage householdSize={householdSize} onHouseholdSizeChange={setHouseholdSize} year={year} />
        )}
      </AppShellContent>
      <TabBar>
        <Tab
          active={section === "calc"}
          onClick={() => setSection("calc")}
          icon={<CalculatorIcon size={20} />}
          label="계산"
          activeColor={ACCENT}
        />
        <Tab
          active={section === "info"}
          onClick={() => setSection("info")}
          icon={<BookOpen size={20} />}
          label="제도"
          activeColor={ACCENT}
        />
      </TabBar>
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
