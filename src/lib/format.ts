/** 숫자를 "1,234원" 형식 문자열로 변환. */
export function won(n: number): string {
  return `${Math.round(n).toLocaleString()}원`;
}
