import { Dialog } from "@m1kapp/kit";

export interface AccuracyInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AccuracyInfoDialog({ open, onClose }: AccuracyInfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="어느 쪽이 더 정확해요?" size="sm">
      <div className="flex flex-col gap-3 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <p>
          세 방식 다 같은 사람 기준이어도 결과가 조금씩 달라요. 건강보험료는 "그 해 실제 보수" 기준이고,
          국민연금 기준소득월액은 <b className="text-zinc-900 dark:text-zinc-100">전년도 소득으로 매년 7월에 한 번 정해져서</b>{" "}
          최근 소득 변동을 반영 못 할 수 있어요.
        </p>
        <p>
          복지 급여 심사에서 정부가 실제소득을 확인할 때도 우선순위가 있어요 — 자료를 제출자가 고르는 게 아니라
          공적자료를 자동으로 조회해요.
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <b className="text-zinc-900 dark:text-zinc-100">건강보험공단 보수월액</b> — 1순위
          </li>
          <li>근로복지공단(고용·산재보험) 자료</li>
          <li>
            <b className="text-zinc-900 dark:text-zinc-100">국민연금 기준소득월액</b> — 그다음 순위, 앞 자료가 없을
            때 보조로 사용
          </li>
        </ol>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
          "세전 월급" 방식은 직접 입력값이라 계산은 정확하지만 공적자료로 검증되진 않아요. 실제 심사 결과를
          미리 가늠하려면 건강보험료 기준이 제일 근접해요. 정확한 사업별 기준은 주민센터나 복지로(☎129)에서
          확인하세요.
        </p>
      </div>
    </Dialog>
  );
}
