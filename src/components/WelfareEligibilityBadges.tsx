import { Badge } from "@m1kapp/kit";
import { WELFARE_PROGRAMS } from "../data/welfarePrograms";

interface WelfareEligibilityBadgesProps {
  medianPct: number;
  avgPct: number;
}

/** 각 복지사업의 소득기준 충족 여부를 뱃지로 나열 + 부가 조건 안내. */
export function WelfareEligibilityBadges({ medianPct, avgPct }: WelfareEligibilityBadgesProps) {
  const notes = WELFARE_PROGRAMS.filter((p) => p.note);

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {WELFARE_PROGRAMS.map(({ name, cutoff, basis }) => {
          const met = (basis === "median" ? medianPct : avgPct) <= cutoff;
          return (
            <Badge key={name} variant={met ? "green" : "red"}>
              {name} {cutoff}% {met ? "충족" : "미충족"}
            </Badge>
          );
        })}
      </div>
      {notes.length > 0 && (
        <ul className="mt-2.5 space-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
          {notes.map((p) => (
            <li key={p.name}>
              · {p.name}: {p.note}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
        소득 기준 충족 = 신청 자격이지 자동 지급이 아니에요. 정확한 요건·지원금은 복지로(bokjiro.go.kr)나
        주민센터에서 확인하세요.
      </div>
    </>
  );
}
