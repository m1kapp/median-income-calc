import { InAppSheet } from "@m1kapp/kit";

export interface PensionHelpSheetProps {
  open: boolean;
  onClose: () => void;
}

export function PensionHelpSheet({ open, onClose }: PensionHelpSheetProps) {
  return (
    <InAppSheet open={open} onClose={onClose} title="국민연금 보험료 확인 방법">
      <div className="px-5 pb-6 flex flex-col gap-4 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">모바일</div>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>'내곁에 국민연금' 앱 다운로드</li>
            <li>로그인 후 [가입내역] - [보험료 납부내역] 이동</li>
            <li>최근 월 납부한 연금보험료(본인부담분) 확인</li>
          </ol>
        </div>
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">웹페이지</div>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>
              '국민연금공단' 접속 - 로그인 (
              <a href="https://www.nps.or.kr" target="nps" className="text-blue-600 underline underline-offset-2">
                링크
              </a>
              )
            </li>
            <li>[전자민원] - [개인민원] - [가입내역 조회] 이동</li>
            <li>보험료 납부내역에서 최근 월 보험료(본인부담분) 확인</li>
          </ol>
        </div>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
          급여명세서에 "국민연금" 항목이 있다면 그 금액을 그대로 써도 돼요.
        </p>
      </div>
    </InAppSheet>
  );
}
