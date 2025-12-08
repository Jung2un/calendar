import React from 'react';
import DayCell from './DayCell';
import { EventItem } from '../../types/event';
import { Holiday } from '../../hooks/useHolidays';
import { motion, AnimatePresence } from 'framer-motion';
import { slideX } from '@/lib/motionVariants';
import { format } from 'date-fns';
import { useDragSelection } from '../../hooks/useDragSelection';
import { formatDateSafe, parseDateSafe } from '../../utils/dateUtils';

type Props = {
  weeks: Date[][];
  currentMonth: Date;
  events: EventItem[];
  holidays: Holiday[];
  onDayClick: (d: Date) => void;
  onMultiDaySelect?: (startDate: Date, endDate: Date) => void;
  transitionDir?: number;
};

export default function CalendarGrid({
  weeks,
  currentMonth,
  events,
  holidays,
  onDayClick,
  onMultiDaySelect,
  transitionDir = 1,
}: Props) {
  const { dragState, startDrag, updateDrag, endDrag, cancelDrag } = useDragSelection();
  function eventsForDay(d: Date) {
    const key = formatDateSafe(d);
    return events.filter((e: EventItem) => e.date === key);
  }

  function holidayForDay(d: Date) {
    const key = formatDateSafe(d);
    return holidays.find((h: Holiday) => h.date === key);
  }

  function handleMouseDown(date: Date, event: React.MouseEvent) {
    // 우클릭이나 다른 버튼은 무시
    if (event.button !== 0) return;

    event.preventDefault();
    startDrag(date);
  }

  function handleMouseEnter(date: Date) {
    if (dragState.isActive) {
      updateDrag(date);
    }
  }

  function handleMouseUp(date: Date) {
    if (dragState.isActive) {
      const result = endDrag();

      // 단일 날짜 클릭인지 다중 날짜 드래그인지 확인
      if (result.selectedDates.length === 1) {
        onDayClick(date);
      } else if (
        result.selectedDates.length > 1 &&
        onMultiDaySelect &&
        result.startDate &&
        result.endDate
      ) {
        onMultiDaySelect(result.startDate, result.endDate);
      }
    }
  }

  // 터치 이벤트 핸들러 (모바일 지원)
  function handleTouchStart(date: Date, event: React.TouchEvent) {
    event.preventDefault();
    startDrag(date);
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (!dragState.isActive) return;

    event.preventDefault();
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dateStr = element?.getAttribute('data-date');

    if (dateStr) {
      const date = parseDateSafe(dateStr);
      updateDrag(date);
    }
  }

  function handleTouchEnd(date: Date, event: React.TouchEvent) {
    if (dragState.isActive) {
      event.preventDefault();
      const result = endDrag();

      // 단일 날짜 클릭인지 다중 날짜 드래그인지 확인
      if (result.selectedDates.length === 1) {
        onDayClick(date);
      } else if (
        result.selectedDates.length > 1 &&
        onMultiDaySelect &&
        result.startDate &&
        result.endDate
      ) {
        onMultiDaySelect(result.startDate, result.endDate);
      }
    }
  }

  // 드래그 중 마우스가 그리드 밖으로 나가면 취소
  function handleMouseLeave() {
    if (dragState.isActive) {
      cancelDrag();
    }
  }

  function isDateSelected(date: Date) {
    const key = formatDateSafe(date);
    return dragState.selectedDates.includes(key);
  }

  // key 변경 시 AnimatePresence가 작동 (월 이동 시)
  const monthKey = format(currentMonth, 'yyyy-MM');

  return (
    <div className="relative h-full" onMouseLeave={handleMouseLeave} onTouchMove={handleTouchMove}>
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial="hidden"
          animate="show"
          exit="exit"
          variants={slideX(transitionDir)}
          className="h-full will-change-transform"
        >
          {/* 고정된 그리드 높이 */}
          <div className="grid h-full grid-rows-6 gap-0.5 sm:gap-2">
            {weeks.map((week: Date[], wi: number) => (
              <div key={wi} className="grid grid-cols-7 gap-0.5 sm:gap-2">
                {week.map((d: Date) => (
                  <DayCell
                    key={d.toISOString()}
                    date={d}
                    currentMonth={currentMonth}
                    events={eventsForDay(d)}
                    holiday={holidayForDay(d)}
                    onClick={onDayClick}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    isSelected={isDateSelected(d)}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
