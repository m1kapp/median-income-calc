import { useState } from "react";
import { Divider, Section, SectionHeader } from "@m1kapp/kit";
import { ChevronRight, FileQuestion, Landmark, Scale, ShieldCheck, Stethoscope, Wallet } from "lucide-react";
import type { IncomeYear } from "../data/incomeStandards";
import { AccuracyInfoDialog } from "./AccuracyInfoDialog";
import { BenefitInfoDialog } from "./BenefitInfoDialog";
import { IncomeConceptInfoDialog } from "./IncomeConceptInfoDialog";
import { IncomeHelpSheet } from "./IncomeHelpSheet";
import { PensionHelpSheet } from "./PensionHelpSheet";
import { WageHelpSheet } from "./WageHelpSheet";
import { WelfareProgramsSection } from "./WelfareProgramsSection";

export interface SystemInfoPageProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
}

type InfoKey = "concept" | "benefit" | "accuracy" | "wage" | "health" | "pension";

const ROWS: { key: InfoKey; icon: typeof Stethoscope; title: string; desc: string }[] = [
  { key: "concept", icon: Scale, title: "기준중위소득 vs 월평균소득", desc: "이 계산기가 쓰는 두 기준의 차이" },
  { key: "benefit", icon: FileQuestion, title: "생계·의료·주거·교육급여란", desc: "4대 급여 선정기준 한 줄 설명" },
  { key: "accuracy", icon: ShieldCheck, title: "어느 산정 방식이 더 정확해요?", desc: "정부 실제소득 심사 우선순위" },
  { key: "wage", icon: Wallet, title: "세전 월급, 세후랑 헷갈릴 때", desc: "지급총액 확인하는 법" },
  { key: "health", icon: Stethoscope, title: "건강보험료 확인 방법", desc: "국민건강보험공단 공식 조회" },
  { key: "pension", icon: Landmark, title: "국민연금 보험료 확인 방법", desc: "국민연금공단 공식 조회" },
];

export function SystemInfoPage({ householdSize, onHouseholdSizeChange, year }: SystemInfoPageProps) {
  const [open, setOpen] = useState<InfoKey | null>(null);

  return (
    <>
      <WelfareProgramsSection householdSize={householdSize} onHouseholdSizeChange={onHouseholdSizeChange} year={year} />

      <Divider spacing="sm" />

      <Section className="pt-4 pb-4">
        <SectionHeader>더 알아보기</SectionHeader>
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 divide-y divide-zinc-200 dark:divide-zinc-700 overflow-hidden">
          {ROWS.map((row) => (
            <button
              key={row.key}
              onClick={() => setOpen(row.key)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <row.icon size={18} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">{row.title}</div>
                <div className="text-[12px] text-zinc-500 dark:text-zinc-400">{row.desc}</div>
              </div>
              <ChevronRight size={16} className="shrink-0 text-zinc-300 dark:text-zinc-600" />
            </button>
          ))}
        </div>
      </Section>

      <Divider spacing="sm" />

      <Section className="pb-4">
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
          이 앱은 보건복지부·국민연금공단·국민건강보험공단 공시 데이터를 기반으로 한 개인용 추정 계산기예요.
          공식 심사 결과와 다를 수 있고, 신청 자격의 최종 확인은 항상 주민센터나 복지로(bokjiro.go.kr,
          ☎129)에서 하세요.
        </p>
      </Section>

      <IncomeConceptInfoDialog open={open === "concept"} onClose={() => setOpen(null)} />
      <BenefitInfoDialog open={open === "benefit"} onClose={() => setOpen(null)} />
      <AccuracyInfoDialog open={open === "accuracy"} onClose={() => setOpen(null)} />
      <WageHelpSheet open={open === "wage"} onClose={() => setOpen(null)} />
      <IncomeHelpSheet open={open === "health"} onClose={() => setOpen(null)} />
      <PensionHelpSheet open={open === "pension"} onClose={() => setOpen(null)} />
    </>
  );
}
