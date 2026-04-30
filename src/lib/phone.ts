/**
 * 전화번호 정규화 — 블랙리스트 매칭용 표준 형태로 변환
 *
 * 입력 예시 → 출력
 *   +821077556700      → 01077556700
 *   +82 10-7755-6700   → 01077556700
 *   010-7755-6700      → 01077556700
 *   01077556700        → 01077556700
 *   +82109300663658    → 0109300663658 (자릿수 이상은 그대로 보존)
 *   ""                 → ""
 *
 * 규칙
 *   1. 비숫자 모두 제거
 *   2. "82"로 시작하면 → "0"으로 치환 (한국 국가코드)
 *   3. 그 외에는 그대로 (이미 0으로 시작하거나 다른 국가코드)
 */
export function normalizePhone(input: string | null | undefined): string {
  if (!input) return "";
  // 비숫자 제거
  const digits = String(input).replace(/\D+/g, "");
  if (!digits) return "";
  // 한국 국가코드 처리: 82로 시작하면 0으로 치환
  if (digits.startsWith("82")) {
    return "0" + digits.slice(2);
  }
  return digits;
}
