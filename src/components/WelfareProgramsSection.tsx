import { useState } from "react";
import { Section, SectionHeader, SegmentedControl } from "@m1kapp/kit";
import { ExternalLink } from "lucide-react";
import { 기준중위소득, 도시근로자월평균소득, type IncomeYear } from "../data/incomeStandards";
import { WELFARE_PROGRAMS, type WelfareProgram } from "../data/welfarePrograms";
import { won } from "../lib/format";
import { HouseholdSizePicker } from "./HouseholdSizePicker";

export interface WelfareProgramsSectionProps {
  householdSize: number;
  onHouseholdSizeChange: (size: number) => void;
  year: IncomeYear;
}

type Basis = "median" | "mean";
const BASIS_OPTIONS: { value: Basis; label: string }[] = [
  { value: "median", label: "중위소득 기준" },
  { value: "mean", label: "월평균소득 기준" },
];

const SCOPE_LABEL: Record<WelfareProgram["scope"], string> = {
  national: "국가",
  seoul: "서울특별시",
  gyeonggi: "경기도",
};

// 프로그램마다 정확한 법령 시행일자까진 검증 못 해서, 대신 이 데이터를 언제 확인했는지 표시
const DATA_CHECKED_ON = "2026.07.19";

function ProgramCard({ p, base }: { p: WelfareProgram; base: number }) {
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-3 hover:opacity-70 transition-opacity"
    >
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500 dark:text-zinc-400">
          {SCOPE_LABEL[p.scope]}
        </span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</span>
        <ExternalLink size={11} className="shrink-0 text-zinc-300 dark:text-zinc-600" />
      </div>
      <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">{p.desc}</div>
      {p.note && <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{p.note}</div>}
      <div className="mt-1.5 flex items-baseline justify-between gap-1.5">
        <span>
          <span className="font-bold" style={{ color: "var(--kit-accent)" }}>
            {won(base * (p.cutoff / 100))}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500"> 이하 · {p.cutoff}%</span>
        </span>
        <span className="shrink-0 text-[10px] text-zinc-300 dark:text-zinc-600">확인 {DATA_CHECKED_ON}</span>
      </div>
    </a>
  );
}

export function WelfareProgramsSection({ householdSize, onHouseholdSizeChange, year }: WelfareProgramsSectionProps) {
  const [basis, setBasis] = useState<Basis>("median");
  const medianBase = 기준중위소득[year][householdSize - 1];
  const meanBase = 도시근로자월평균소득[year][householdSize - 1];
  const base = basis === "median" ? medianBase : meanBase;

  const filtered = WELFARE_PROGRAMS.filter((p) => p.basis === basis).sort((a, b) => b.cutoff - a.cutoff);

  return (
    <Section className="pt-4">
      <SectionHeader>복지·주거사업 소득기준</SectionHeader>
      <p className="-mt-1.5 mb-3 text-[12px] text-zinc-500 dark:text-zinc-400">
        내 보수월액이 아래 금액 이하면 신청 자격. 금액 큰 순으로 정렬, 이름 누르면 공식 안내 페이지로.
      </p>

      <HouseholdSizePicker value={householdSize} onChange={onHouseholdSizeChange} className="mb-3" />

      <SegmentedControl options={BASIS_OPTIONS} value={basis} onChange={(v) => setBasis(v as Basis)} className="mb-3" />

      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 px-4 divide-y divide-zinc-200 dark:divide-zinc-700">
        {filtered.map((p) => (
          <ProgramCard key={p.name} p={p} base={base} />
        ))}
      </div>

      <p className="mt-2.5 text-[11px] text-zinc-400 dark:text-zinc-500">
        {year}년 {householdSize}인가구, {basis === "median" ? "기준중위소득" : "도시근로자 월평균소득"} 기준.
        서울시 외 지자체·나머지 서울시 사업(서울형 가사지원 등)은 지역·시기마다 달라서 이 목록엔 없어요. 소득
        기준 충족은 신청 자격이지 자동 지급이 아니며, 정확한 요건은 복지로(bokjiro.go.kr)나 주민센터에서
        확인하세요.
      </p>
    </Section>
  );
}
