// 소득 %로 자격을 판정하는 대표 복지·주거사업. 전부 정부/지자체 공식 자료로 확인한 것만 수록.
// 신혼부부 전세자금대출(버팀목) 등 절대소득 상한 방식 사업은 %가 아니라서 제외.
// 지자체는 서울시 대표사업 일부만 — 나머지 지자체·나머지 서울시 사업은 수백 개 단위라 별도 작업 필요.
//
// 가구원수 제한: 검색 확인 결과 이 목록 중 "이 인원수는 아예 신청 불가" 같은 하드 컷오프는 없음.
// (예: 청년월세특별지원도 1인가구 전용 아니고 핵심 조건은 "부모와 별거". 서울시 청년수당도 직접
// 검색 재확인 — "1인가구 제한 없음", 가구원수 무관하게 가구소득 150%로 판정. 신혼부부특별공급도
// 인원수 제한이 아니라 소득기준표가 가구원수별로 다르게 나올 뿐 — 그건 이 앱이 이미 계산해서 보여줌.)
// 그래서 가구원수별 비활성화 로직은 없음 — 아래 금액 자체가 이미 선택한 가구원수 기준 값.
//
// 경기도 청년기본소득은 소득심사 자체가 없는 무조건 지급(만 24세 도민 전원)이라 % 프레임에 안 맞아서 제외.

export interface WelfareProgram {
  name: string;
  /** 한 줄 설명 */
  desc: string;
  /** 이 % 이하면 소득 기준 충족 */
  cutoff: number;
  /** 어느 소득 대비 %인지 — 기준중위소득 또는 도시근로자 월평균소득 */
  basis: "median" | "mean";
  /** 국가 전국 사업인지 특정 지자체 자체 사업인지 */
  scope: "national" | "seoul" | "gyeonggi";
  /** 소득 기준 외 추가로 봐야 하는 조건(연령 등) */
  note?: string;
  /** 공식 안내 페이지 */
  link: string;
}

export const WELFARE_PROGRAMS: WelfareProgram[] = [
  {
    name: "생계급여",
    desc: "생활에 기본적으로 필요한 현금을 매달 지원. 4대 급여 중 커트라인이 제일 낮음",
    cutoff: 32,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010300",
  },
  {
    name: "의료급여",
    desc: "병원비·약값 등 의료비 본인부담을 낮춰줌",
    cutoff: 40,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010300",
  },
  {
    name: "주거급여",
    desc: "전월세 임차료나 자가 주택 수선비를 지원",
    cutoff: 48,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010300",
  },
  {
    name: "교육급여",
    desc: "학생 자녀의 학용품비·부교재비 등 교육 관련 비용을 지원",
    cutoff: 50,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010300",
  },
  {
    name: "차상위계층",
    desc: "기초수급자 바로 위 소득 구간 — 각종 요금 감면·지원사업 자격이 됨",
    cutoff: 50,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010300",
  },
  {
    name: "한부모가족지원",
    desc: "한부모·조손 가정에 아동양육비 등을 현금 지원",
    cutoff: 65,
    basis: "median",
    scope: "national",
    note: "부모 25세 이상 기준 — 24세 이하 청소년한부모는 72%",
    link: "https://www.mogef.go.kr/io/ind/io_ind_s005d.do?mid=old919&bbtSn=15",
  },
  {
    name: "긴급복지지원",
    desc: "실직·질병 등 갑작스러운 위기상황에 생계비를 일시 긴급 지원",
    cutoff: 75,
    basis: "median",
    scope: "national",
    link: "https://www.mohw.go.kr/menu.es?mid=a10708010100",
  },
  {
    name: "아이돌봄서비스",
    desc: "만 12세 이하 아동을 돌보미가 집에서 돌봐주는 서비스, 이용요금 일부를 정부가 지원",
    cutoff: 250,
    basis: "median",
    scope: "national",
    note: "소득구간(75/120/200/250%)별로 지원 비율이 다름 — 낮을수록 많이 지원, 250% 넘으면 지원 없음(전액 본인부담)",
    link: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000024",
  },
  {
    name: "국민취업지원제도(Ⅰ유형)",
    desc: "구직촉진수당 등 취업 지원 서비스와 생계비를 함께 지원",
    cutoff: 60,
    basis: "median",
    scope: "national",
    note: "재산 4억원 이하(청년은 5억원 이하) 등 소득 외 요건도 있음",
    link: "https://www.work24.go.kr/ua/z/z/1300/selectEmssRqutIntro.do",
  },
  {
    name: "청년내일저축계좌",
    desc: "매달 저축하면 정부가 지원금을 더해줘 목돈을 만들어주는 자산형성 상품",
    cutoff: 100,
    basis: "median",
    scope: "national",
    note: "근로·사업소득 기준. 소득이 너무 적어도(중위소득 24% 미만) 대상 아님",
    link: "https://hope.welfareinfo.or.kr/bsns/bsnsIntrcnAcc.do",
  },
  {
    name: "희망저축계좌Ⅱ",
    desc: "차상위·주거교육급여 수급가구가 목돈을 모으도록 정부가 지원금을 더해주는 자산형성 상품",
    cutoff: 50,
    basis: "median",
    scope: "national",
    link: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00000100",
  },
  {
    name: "청년월세 특별지원",
    desc: "부모와 따로 사는 무주택 청년에게 월세 일부를 현금 지원",
    cutoff: 60,
    basis: "median",
    scope: "national",
    note: "만 19~34세, 부모와 별거(독립거주)가 핵심 조건. 부모 등 원가구 소득도 100% 이하여야 함",
    link: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004661",
  },
  {
    name: "신혼부부 특별공급(청약)",
    desc: "신혼부부에게 아파트 분양 물량 일부를 우선 배정",
    cutoff: 140,
    basis: "mean",
    scope: "national",
    note: "배우자도 소득 있으면 160%까지. 정확한 구간·금액은 단지 모집공고마다 다름",
    link: "https://xn--vg1bl39d.kr/subscriptionIntro/qualify.do",
  },
  {
    name: "생애최초 특별공급(청약)",
    desc: "생애 처음 집을 사는 무주택자에게 아파트 분양 물량 일부를 우선 배정",
    cutoff: 160,
    basis: "mean",
    scope: "national",
    link: "https://xn--vg1bl39d.kr/subscriptionIntro/qualify.do",
  },
  {
    name: "행복주택(다자녀 특별공급)",
    desc: "다자녀가구에게 공공 임대주택(행복주택) 물량 일부를 우선 배정",
    cutoff: 120,
    basis: "mean",
    scope: "national",
    note: "85㎡ 이하 기준. 청년형·신혼부부형 등 유형별로 소득기준이 따로 있음",
    link: "https://apply.lh.or.kr/lhapply/cm/cntnts/cntntsView.do?cntntsId=1201391&mi=1201663",
  },
  {
    name: "국민임대주택",
    desc: "무주택 서민에게 시세보다 저렴하게 장기 임대하는 공공주택",
    cutoff: 70,
    basis: "mean",
    scope: "national",
    note: "3인 이상 가구 기준 70% — 1인가구는 90%, 2인가구는 80%로 더 완화됨",
    link: "https://apply.lh.or.kr/lhapply/cm/cntnts/cntntsView.do?mi=1144&cntntsId=1023",
  },
  {
    name: "서울형 기초보장",
    desc: "국민기초생활보장 수급 자격은 안 되지만 어려운 서울시민을 시 예산으로 지원",
    cutoff: 48,
    basis: "median",
    scope: "seoul",
    link: "https://news.seoul.go.kr/welfare/archives/19203",
  },
  {
    name: "서울시 청년수당",
    desc: "구직·자기계발 중인 서울 청년에게 매달 현금(활동지원금) 지원",
    cutoff: 150,
    basis: "median",
    scope: "seoul",
    note: "만 19~34세 서울 거주 청년. 1인가구 제한 없음 — 가구원수 무관하게 가구소득으로 판정",
    link: "https://youth.seoul.go.kr",
  },
  {
    name: "경기도 청년노동자 통장",
    desc: "매달 저축하면 경기도가 지원금을 더해줘 목돈을 만들어주는 청년 자산형성 상품",
    cutoff: 120,
    basis: "median",
    scope: "gyeonggi",
    note: "만 18~34세 경기도 거주 근로 청년. 가구 건강보험료로 판정, 출처마다 100~120%로 다르게 안내되니 공식 페이지에서 그해 공고 재확인 권장",
    link: "https://account.ggwf.or.kr",
  },
];
