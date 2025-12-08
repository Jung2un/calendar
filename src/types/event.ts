export type EventItem = {
  id: string;
  user: string;
  title: string;
  notes?: string;
  date: string; // yyyy-MM-dd
  createdAt: string;
  // 다중 날짜 이벤트 지원
  groupId?: string; // 연결된 이벤트들의 그룹 ID
  startDate?: string; // 시작 날짜 (다중 날짜 이벤트인 경우)
  endDate?: string; // 종료 날짜 (다중 날짜 이벤트인 경우)
  color?: string; // 이벤트 색상
};
