/**
 * 소득분포를 로그정규분포(log-normal)로 근사한다 — 개인/가구 소득분포 모델링에
 * 표준적으로 쓰이는 분포. 로그정규분포에서 median = e^μ, mean = median·e^(σ²/2)
 * 이므로, 우리가 가진 실제 공시값(기준중위소득=중앙값, 도시근로자월평균소득=평균)의
 * 비율에서 σ를 역산한다. 임의로 고른 값이 아니라 공식으로 도출한 값이다.
 *
 * 주의: 기준중위소득(전체 가구 기준)과 도시근로자월평균소득(도시 근로자 가구
 * 기준)은 모집단이 정확히 같지 않아 이 비율은 근사치다. 그래도 두 수치 다
 * 실제 보건복지부/여성가족부 공시값이므로, 눈대중으로 곡선을 그리는 것보다는
 * 훨씬 근거가 있다.
 */
export function lognormalSigma(median: number, mean: number): number {
  const ratio = Math.max(mean / median, 1.0001);
  return Math.sqrt(2 * Math.log(ratio));
}

/** 로그정규분포 확률밀도함수. r = 값 ÷ 기준값(1이 기준점), mu = ln(기준점 대비 분포 중앙값 위치). */
export function lognormalDensity(r: number, mu: number, sigma: number): number {
  if (r <= 0) return 0;
  const z = (Math.log(r) - mu) / sigma;
  return (1 / (r * sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}
