export const PASTEL_COLORS = [
  {
    bg: 'bg-pink-100/80',
    text: 'text-pink-900',
    border: 'border-pink-200',
  },
  {
    bg: 'bg-purple-100/80',
    text: 'text-purple-900',
    border: 'border-purple-200',
  },
  {
    bg: 'bg-indigo-100/80',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
  },
  {
    bg: 'bg-blue-100/80',
    text: 'text-blue-900',
    border: 'border-blue-200',
  },
  {
    bg: 'bg-cyan-100/80',
    text: 'text-cyan-900',
    border: 'border-cyan-200',
  },
  {
    bg: 'bg-teal-100/80',
    text: 'text-teal-900',
    border: 'border-teal-200',
  },
  {
    bg: 'bg-emerald-100/80',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
  },
  {
    bg: 'bg-green-100/80',
    text: 'text-green-900',
    border: 'border-green-200',
  },
  {
    bg: 'bg-lime-100/80',
    text: 'text-lime-900',
    border: 'border-lime-200',
  },
  {
    bg: 'bg-yellow-100/80',
    text: 'text-yellow-900',
    border: 'border-yellow-200',
  },
  {
    bg: 'bg-amber-100/80',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
  {
    bg: 'bg-orange-100/80',
    text: 'text-orange-900',
    border: 'border-orange-200',
  },
  {
    bg: 'bg-red-100/80',
    text: 'text-red-900',
    border: 'border-red-200',
  },
  {
    bg: 'bg-rose-100/80',
    text: 'text-rose-900',
    border: 'border-rose-200',
  },
];

// 색상 인덱스를 기반으로 색상 반환
export function getEventColor(colorIndex: number) {
  return PASTEL_COLORS[colorIndex % PASTEL_COLORS.length];
}

// 문자열 해시를 기반으로 색상 인덱스 생성
export function getColorIndexFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash) % PASTEL_COLORS.length;
}

// 이벤트 ID를 기반으로 색상 반환
export function getEventColorById(eventId: string) {
  const colorIndex = getColorIndexFromString(eventId);
  return getEventColor(colorIndex);
}
