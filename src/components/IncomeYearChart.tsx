import { YEARS, 기준중위소득, type IncomeYear } from "../data/incomeStandards";

export interface IncomeYearChartProps {
  householdSize: number;
  year: IncomeYear;
  wage: number;
}

const W = 300;
const H = 132;
const BAR_W = 46;
const GAP = (W - BAR_W * YEARS.length) / (YEARS.length + 1);
const TOP_PAD = 34;
const BOTTOM_PAD = 28;
const PLOT_H = H - TOP_PAD - BOTTOM_PAD;

function formatMan(won: number): string {
  return `${Math.round(won / 10_000).toLocaleString()}만`;
}

/**
 * 선택한 가구원수 기준으로 24/25/26년 기준중위소득 막대 + 내 추정 소득을
 * 점선 기준선으로 겹쳐 보여주는 미니 차트. "내가 이 흐름의 어디쯤인지"를
 * 한눈에 보여주는 게 목적. 막대 높이는 연도별 값끼리만 비교해 스케일을
 * 잡는다 — 내 소득을 스케일에 같이 넣으면 소득이 막대값보다 훨씬 크거나
 * 작을 때 막대가 찌그러져버려서, 범위를 벗어난 소득은 화살표 배지로만
 * 표시한다.
 */
export function IncomeYearChart({ householdSize, year, wage }: IncomeYearChartProps) {
  const values = YEARS.map((y) => 기준중위소득[y][householdSize - 1]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const scaleMax = maxValue * 1.25;
  const scaleMin = minValue * 0.9;

  const scale = (v: number) => ((v - scaleMin) / (scaleMax - scaleMin)) * PLOT_H;
  const wageY = TOP_PAD + PLOT_H - scale(wage);
  const wageAbove = wage > scaleMax;
  const wageBelow = wage < scaleMin;
  const wageOnChart = !wageAbove && !wageBelow;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-4 border-t-2 border-dashed border-current" />내 소득 {formatMan(wage)}
        </span>
        {!wageOnChart && (
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">
            {wageAbove ? "▲ 막대 범위 위" : "▼ 막대 범위 아래"}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="연도별 기준중위소득 비교">
        {wageOnChart && (
          <line
            x1={0}
            x2={W}
            y1={wageY}
            y2={wageY}
            stroke="var(--kit-accent)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            opacity={0.55}
          />
        )}

        {YEARS.map((y, i) => {
          const value = values[i];
          const barH = Math.max(scale(value), 3);
          const x = GAP + i * (BAR_W + GAP);
          const barY = TOP_PAD + PLOT_H - barH;
          const active = y === year;
          return (
            <g key={y}>
              <rect
                x={x}
                y={barY}
                width={BAR_W}
                height={barH}
                rx={8}
                fill={active ? "var(--kit-accent)" : "currentColor"}
                className={active ? "" : "text-zinc-200 dark:text-zinc-700"}
              />
              <text
                x={x + BAR_W / 2}
                y={barY - 6}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                className={active ? "fill-zinc-900 dark:fill-zinc-100" : "fill-zinc-400 dark:fill-zinc-500"}
              >
                {formatMan(value)}
              </text>
              <text
                x={x + BAR_W / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight={active ? 800 : 500}
                className={active ? "fill-zinc-900 dark:fill-zinc-100" : "fill-zinc-400 dark:fill-zinc-500"}
              >
                {y}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
