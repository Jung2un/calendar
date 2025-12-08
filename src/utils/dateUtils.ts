/**
 * Date 객체를 YYYY-MM-DD 형태의 문자열로 변환 (시간대 문제 방지)
 */
export function formatDateSafe(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 문자열을 Date 객체로 변환 (시간대 문제 방지)
 */
export function parseDateSafe(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 두 날짜 사이의 모든 날짜를 배열로 반환 (시간대 문제 방지)
 */
export function getDatesBetween(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;

  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const final = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= final) {
    dates.push(formatDateSafe(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 날짜에 일수를 더한 새로운 Date 객체 반환 (시간대 문제 방지)
 */
export function addDaysSafe(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
}
