import { Dialog } from "@m1kapp/kit";

export interface IncomeConceptInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export function IncomeConceptInfoDialog({ open, onClose }: IncomeConceptInfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="중위소득 vs 월평균소득" size="sm">
      <div className="flex flex-col gap-4 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">기준중위소득</div>
          <p>
            정부가 기초생활보장 등 복지 급여 대상을 정할 때 쓰는 기준 소득. 가구를 소득순으로 줄 세웠을 때
            한가운데 값(중앙값)을 바탕으로 매년 정부가 고시함. 생계급여·의료급여 등 커트라인이 전부 이 값의 %로
            정해짐.
          </p>
        </div>
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">도시근로자 월평균소득</div>
          <p>
            도시에 사는 근로자 가구의 평균 소득. 한부모가족지원 등 일부 복지사업 기준으로 쓰임. "평균"이라
            고소득 가구 때문에 중위소득보다 값이 더 큼 — 그래서 같은 월급이어도 도시근로자 월평균소득 기준으로
            계산하면 %가 더 낮게 나와요.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
