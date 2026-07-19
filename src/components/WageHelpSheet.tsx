import { InAppSheet } from "@m1kapp/kit";

export interface WageHelpSheetProps {
  open: boolean;
  onClose: () => void;
}

export function WageHelpSheet({ open, onClose }: WageHelpSheetProps) {
  return (
    <InAppSheet open={open} onClose={onClose} title="세전 월급, 세후랑 헷갈릴 때">
      <div className="px-5 pb-6 flex flex-col gap-4 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">세전(입력할 값)</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>급여명세서의 "지급총액" (공제 전 합계)</li>
            <li>또는 근로계약서 연봉 ÷ 12</li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">세후(실수령액)는 안 됨</div>
          <p>
            통장에 찍히는 실수령액은 부양가족 수·비과세액 등 사람마다 공제 조건이 달라서, 정해진 비율을
            곱해 세전으로 되돌리는 계산 자체가 부정확해요. 실수령액만 알고 계신다면 급여명세서를 확인해
            지급총액을 넣어주세요.
          </p>
        </div>
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">급여명세서가 없다면</div>
          <p>
            국세청 홈택스(
            <a href="https://www.hometax.go.kr" target="hometax" className="text-blue-600 underline underline-offset-2">
              링크
            </a>
            )에서 [My홈택스] - [지급명세서 등 제출내역]으로 조회할 수 있어요. 또는 건강보험료·국민연금
            보험료를 알고 있다면 "산정 기준"을 건보료/국민연금으로 바꿔 계산해도 돼요 — 그쪽은 세전/세후
            구분 없이 보험료 요율로 역산해서 결과가 같아요.
          </p>
        </div>
      </div>
    </InAppSheet>
  );
}
