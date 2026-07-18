import { YEARS, 기준중위소득, type IncomeYear } from "../data/incomeStandards";

export interface IncomeYearChartProps {
  householdSize: number;
  year: IncomeYear;
  wage: number;
}

const W = 300;
const H = 120;
const BAR_W = 46;
const GAP = (W - BAR_W * YEARS.length) / (YEARS.length + 1);
const TOP_PAD = 22;
const BOTTOM_PAD = 28;
const PLOT_H = H - TOP_PAD - BOTTOM_PAD;

function formatMan(won: number): string {
  return `${Math.round(won / 10_000).toLocaleString()}만`;
}

/**
 * 선택한 가구원수 기준으로 24/25/26년 기준중위소득 막대 + 내 추정 소득을
 * 점선 기준선으로 겹쳐 보여주는 미니 차트. "내가 이 흐름의 어디쯤인지"를
 * 한눈에 보여주는 게 목적. 기준선 라벨은 값에 따라 어느 막대 라벨과도
 * 겹칠 수 있어 플롯 밖 범례로 빼고, SVG 안에는 선만 그린다.
 */
export function IncomeYearChart({ householdSize, year, wage }: IncomeYearChartProps) {
  const values = YEARS.map((y) => 기준중위소득[y][householdSize - 1]);
  const maxValue = Math.max(...values, wage);
  const minValue = Math.min(...values, wage);
  const scaleMax = maxValue * 1.08;
  const scaleMin = Math.min(minValue * 0.92, scaleMax * 0.5);

  const scale = (v: number) => ((v - scaleMin) / (scaleMax - scaleMin)) * PLOT_H;
  const wageY = TOP_PAD + PLOT_H - scale(wage);
  const wageOnChart = wage <= scaleMax;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
        <span className="inline-block h-0 w-4 border-t-2 border-dashed border-current" />
        내 소득 {formatMan(wage)}
        {!wageOnChart && <span className="text-zinc-400 dark:text-zinc-500 font-normal">(그래프 범위 초과)</span>}
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
          const barH = scale(value);
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
