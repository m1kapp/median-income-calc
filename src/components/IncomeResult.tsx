import { Badge, Button, StatChip } from "@m1kapp/kit";
import { 급여기준 } from "../data/incomeStandards2026";

export interface IncomeResultProps {
  wage: number;
  medianPct: number;
  avgPct: number;
  onBack: () => void;
}

export function IncomeResult({ wage, medianPct, avgPct, onBack }: IncomeResultProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-2xl bg-zinc-50 p-5 text-center">
        <div className="text-[13px] text-zinc-500">추정 보수월액</div>
        <div className="mt-1 text-2xl font-bold text-zinc-900">{wage.toLocaleString()}원</div>
      </div>

      <div className="flex gap-3">
        <StatChip label="기준 중위소득 대비 (%)" value={medianPct} />
        <StatChip label="도시근로자 월평균소득 대비 (%)" value={avgPct} />
      </div>

      <div>
        <div className="mb-1.5 text-[13px] font-medium text-zinc-500">급여별 선정기준 충족 여부</div>
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
      </div>

      <Button variant="light" full onClick={onBack}>
        다시 계산
      </Button>
    </div>
  );
}
