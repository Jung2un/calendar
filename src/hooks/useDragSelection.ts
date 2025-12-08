import { useState, useCallback } from "react";
import { formatDateSafe, getDatesBetween } from "../utils/dateUtils";

export type DragState = {
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

  const startDrag = useCallback((date: Date) => {
    setDragState({
      isActive: true,
      startDate: date,
      endDate: date,
      selectedDates: [formatDateSafe(date)],
    });
  }, []);

  const updateDrag = useCallback((date: Date) => {
    setDragState((prev) => {
      if (!prev.isActive || !prev.startDate) return prev;

      const selectedDates = getDatesBetween(prev.startDate, date);

      return {
        ...prev,
        endDate: date,
        selectedDates,
      };
    });
  }, []);

  const endDrag = useCallback(() => {
    const result = { ...dragState };
    setDragState({
      isActive: false,
      startDate: null,
      endDate: null,
      selectedDates: [],
    });
    return result;
  }, [dragState]);

  const cancelDrag = useCallback(() => {
    setDragState({
      isActive: false,
      startDate: null,
      endDate: null,
      selectedDates: [],
    });
  }, []);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
  };
}
