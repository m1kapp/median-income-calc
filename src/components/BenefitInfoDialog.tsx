import { Dialog } from "@m1kapp/kit";
import { 급여기준 } from "../data/incomeStandards";

export interface BenefitInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const BENEFIT_COPY: Record<keyof typeof 급여기준, string> = {
  생계급여: "생활에 기본적으로 필요한 현금을 매달 지원. 4개 급여 중 커트라인이 제일 낮음.",
  의료급여: "병원비·약값 등 의료비 본인부담을 낮춰줌.",
  주거급여: "전월세 임차료나 자가 주택 수선비를 지원.",
  교육급여: "학생 자녀의 학용품비·부교재비 등 교육 관련 비용을 지원.",
};

export function BenefitInfoDialog({ open, onClose }: BenefitInfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="급여별 선정기준이 뭐예요?" size="sm">
      <div className="flex flex-col gap-3 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <p>
          기초생활보장제도의 4대 급여. 전부 <b className="text-zinc-900 dark:text-zinc-100">기준중위소득 대비 %</b>{" "}
          커트라인으로 정해져 있고, 내 소득비율이 그 % 이하면 해당 급여를 신청할 자격이 됨 (자격이지, 자동 지급은
          아님 — 별도 신청·심사 필요).
        </p>
        <ul className="space-y-2">
          {Object.entries(급여기준).map(([name, cutoff]) => (
            <li key={name}>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {name} {cutoff}%
              </span>
              <span className="block text-zinc-500 dark:text-zinc-400">{BENEFIT_COPY[name as keyof typeof 급여기준]}</span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
          정확한 자격 요건(재산 기준 등)과 지원 금액은 급여마다 따로 있어서, 이 앱은 소득 기준 충족 여부만
          보여줘요. 실제 신청은 복지로(bokjiro.go.kr) 또는 주민센터에서.
        </p>
      </div>
    </Dialog>
  );
}
