import { useState } from 'react';
import { format } from 'date-fns';

type DragState = {
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  selectedDates: string[];
};

export function useDragSelection() {
  const [dragState, setDragState] = useState<DragState>({
    isActive: false,
    startDate: null,
    endDate: null,
    selectedDates: [],
  });

  function startDrag(date: Date) {
    setDragState({
      isActive: true,
      startDate: date,
      endDate: date,
      selectedDates: [format(date, 'yyyy-MM-dd')],
    });
  }

  function updateDrag(date: Date) {
    if (!dragState.isActive || !dragState.startDate) return;

    const start = dragState.startDate;
    const end = date;

    // 시작과 끝 날짜 사이의 모든 날짜 계산
    const min = start < end ? start : end;
    const max = start < end ? end : start;

    const dates: string[] = [];
    const current = new Date(min);

    while (current <= max) {
      dates.push(format(current, 'yyyy-MM-dd'));
      current.setDate(current.getDate() + 1);
    }

    setDragState({
      ...dragState,
      endDate: date,
      selectedDates: dates,
    });
  }

  function endDrag() {
    const result = { ...dragState };
    setDragState({
      isActive: false,
      startDate: null,
      endDate: null,
      selectedDates: [],
    });
    return result;
  }

  function cancelDrag() {
    setDragState({
      isActive: false,
      startDate: null,
      endDate: null,
      selectedDates: [],
    });
  }

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
  };
}
