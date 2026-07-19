import { lognormalDensity } from "../lib/incomeDistribution";

export interface IncomeDistributionRulerProps {
  pct: number;
  color?: string;
  axisMax?: number;
  referenceLabel: string;
  /** "median": 기준점(100%)이 분포의 중앙값. "mean": 기준점이 분포의 평균값. */
  referenceKind: "median" | "mean";
  /** lognormalSigma()로 실제 중앙값/평균 비율에서 역산한 값 — 임의값 아님. */
  sigma: number;
}

const W = 300;
const H = 66;
const BASE_Y = 60;
const CURVE_H = 40;
const SAMPLES = 60;

function bellPath(mu: number, sigma: number, axisMax: number): string {
  const points: [number, number][] = [];
  let maxDensity = 0;
  const densities: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const pctAt = (i / SAMPLES) * axisMax;
    const r = Math.max(pctAt / 100, 0.001);
    const d = lognormalDensity(r, mu, sigma);
    densities.push(d);
    if (d > maxDensity) maxDensity = d;
  }
  for (let i = 0; i <= SAMPLES; i++) {
    const x = (i / SAMPLES) * W;
    const y = BASE_Y - CURVE_H * (maxDensity > 0 ? densities[i] / maxDensity : 0);
    points.push([x, y]);
  }
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  return `M0,${BASE_Y} L${line} L${W},${BASE_Y} Z`;
}

export function IncomeDistributionRuler({
  pct,
  color = "var(--kit-accent)",
  axisMax = 200,
  referenceLabel,
  referenceKind,
  sigma,
}: IncomeDistributionRulerProps) {
  const toX = (v: number) => (Math.min(Math.max(v, 0), axisMax) / axisMax) * W;
  const clampedPct = Math.min(Math.max(pct, 0), axisMax);
  const overflow = pct > axisMax;
  const markerX = toX(clampedPct);
  const referenceX = toX(100);
  const labelXPct = Math.min(Math.max((clampedPct / axisMax) * 100, 8), 92);
  const referenceLabelXPct = (100 / axisMax) * 100;
  const showReferenceLabel = Math.abs(clampedPct - 100) > 14;

  // 로그정규분포에서 median = e^mu, mean = median·e^(sigma²/2).
  // referenceKind가 mean이면 100%(=r=1) 지점이 분포의 평균이 되도록 mu를 음수로 이동시킨다.
  const mu = referenceKind === "mean" ? -0.5 * sigma * sigma : 0;

  const gridSteps: number[] = [];
  const gridLabels: number[] = [];
  for (let v = 0; v <= axisMax; v += 20) {
    gridLabels.push(v);
    if (v !== 0 && v !== 100) gridSteps.push(v);
  }

  return (
    <div className="pt-6 pb-1">
      <div className="relative">
        <div
          className="absolute -top-1 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap"
          style={{ left: `${labelXPct}%`, color }}
        >
          {pct}%{overflow && "+"}
        </div>

        {showReferenceLabel && (
          <div
            className="absolute -top-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-zinc-400 dark:text-zinc-500"
            style={{ left: `${referenceLabelXPct}%` }}
          >
            기준 100%
          </div>
        )}

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="mt-4" role="img" aria-label={`${referenceLabel} 분포 대비 내 위치`}>
          <path d={bellPath(mu, sigma, axisMax)} fill={color} opacity={0.1} />
          <line x1={0} x2={W} y1={BASE_Y} y2={BASE_Y} stroke="currentColor" strokeWidth={1} className="text-zinc-200 dark:text-zinc-800" />

          {gridSteps.map((v) => (
            <line
              key={v}
              x1={toX(v)}
              x2={toX(v)}
              y1={BASE_Y - CURVE_H}
              y2={BASE_Y}
              stroke="currentColor"
              strokeWidth={1}
              className="text-zinc-100 dark:text-zinc-800/70"
            />
          ))}

          <line x1={referenceX} x2={referenceX} y1={BASE_Y - CURVE_H - 6} y2={BASE_Y} stroke="currentColor" strokeWidth={2} strokeDasharray="4 3" className="text-zinc-400 dark:text-zinc-500" />

          <line x1={markerX} x2={markerX} y1={BASE_Y - CURVE_H - 14} y2={BASE_Y} stroke={color} strokeWidth={1.5} />
          <circle cx={markerX} cy={BASE_Y} r={4.5} fill={color} stroke="white" strokeWidth={2} className="dark:stroke-zinc-950" />
        </svg>

        <div className="relative mt-0.5 h-3">
          {gridLabels.map((v) => {
            const isEdge = v === 0 || v === axisMax;
            return (
              <span
                key={v}
                className="absolute text-[8px] font-semibold text-zinc-400 dark:text-zinc-500"
                style={
                  v === 0
                    ? { left: 0 }
                    : v === axisMax
                      ? { right: 0 }
                      : { left: `${(v / axisMax) * 100}%`, transform: "translateX(-50%)" }
                }
              >
                {isEdge ? `${v}%` : v}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
