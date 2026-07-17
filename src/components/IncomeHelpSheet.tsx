import { InAppSheet } from "@m1kapp/kit";

export interface IncomeHelpSheetProps {
  open: boolean;
  onClose: () => void;
}

export function IncomeHelpSheet({ open, onClose }: IncomeHelpSheetProps) {
  return (
    <InAppSheet open={open} onClose={onClose} title="건강보험료 확인 방법">
      <div className="px-5 pb-6 flex flex-col gap-4 text-[13.5px] text-zinc-600 dark:text-zinc-400">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">모바일</div>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>'The건강보험' 앱 다운로드</li>
            <li>[민원여기요] - [조회] 이동</li>
            <li>[더보기] - [직장보험료 조회] 이동</li>
            <li>인증 후 최근 건강보험 산정보험료 조회</li>
          </ol>
        </div>
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">웹페이지</div>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>
              '건강보험공단' 접속 - 로그인 (
              <a href="https://www.nhis.or.kr/nhis/index.do" target="nhis" className="text-blue-600 underline underline-offset-2">
                링크
              </a>
              )
            </li>
            <li>[민원여기요] - [개인민원] 이동</li>
            <li>[보험료 조회/신청] - [직장보험료 조회] 이동</li>
            <li>최근 건강보험 산정보험료 조회</li>
          </ol>
        </div>
      </div>
    </InAppSheet>
  );
}
