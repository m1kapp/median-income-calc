import { Badge, Button, Divider, Section, SectionHeader, StatChip } from "@m1kapp/kit";
import { 급여기준 } from "../data/incomeStandards2026";

export interface IncomeResultProps {
  wage: number;
  medianPct: number;
  avgPct: number;
  onBack: () => void;
}

export function IncomeResult({ wage, medianPct, avgPct, onBack }: IncomeResultProps) {
  return (
    <>
      <Section className="pt-4">
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 p-5 text-center">
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">추정 보수월액</div>
          <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{wage.toLocaleString()}원</div>
        </div>

        <div className="mt-3 flex gap-3">
          <StatChip label="기준 중위소득 대비 (%)" value={medianPct} />
          <StatChip label="도시근로자 월평균소득 대비 (%)" value={avgPct} />
        </div>
      </Section>

      <Divider spacing="sm" />

      <Section className="pb-4">
        <SectionHeader>급여별 선정기준 충족 여부</SectionHeader>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(급여기준).map(([name, cutoff]) => {
            const met = medianPct <= cutoff;
            return (
              <Badge key={name} variant={met ? "green" : "red"}>
                {name} {cutoff}% {met ? "충족" : "미충족"}
              </Badge>
            );
          })}
        </div>

        <Button variant="light" full className="mt-4" onClick={onBack}>
          다시 계산
        </Button>
      </Section>
    </>
  );
}
