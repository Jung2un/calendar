import React, { memo } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { EventItem } from '../../types/event';
import { Holiday } from '../../hooks/useHolidays';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motionVariants';
import { getEventColor } from '../../utils/colors';
import { formatDateSafe } from '../../utils/dateUtils';

type Props = {
  date: Date;
  currentMonth: Date;
  events: EventItem[];
  holiday?: Holiday;
  onClick: (d: Date) => void;
  onMouseDown?: (date: Date, event: React.MouseEvent) => void;
  onMouseEnter?: (date: Date) => void;
  onMouseUp?: (date: Date) => void;
  onTouchStart?: (date: Date, event: React.TouchEvent) => void;
  onTouchEnd?: (date: Date, event: React.TouchEvent) => void;
  isSelected?: boolean;
};

function DayCellInner({
  date,
  currentMonth,
  events,
  holiday,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  isSelected = false,
}: Props) {
  const dayNumber = format(date, 'd');
  const inMonth = isSameMonth(date, currentMonth);
  const today = isSameDay(date, new Date());
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  const bg = isSelected ? 'bg-indigo-200/80' : inMonth ? 'bg-white/60' : 'bg-white/20';
  const textColor =
    holiday || isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-slate-900';

  return (
    <motion.button
      layout
      initial="hidden"
      animate="show"
      exit="exit"
      variants={fadeUp}
      onClick={() => onClick(date)}
      onMouseDown={(e) => onMouseDown?.(date, e)}
      onMouseEnter={() => onMouseEnter?.(date)}
      onMouseUp={() => onMouseUp?.(date)}
      onTouchStart={(e) => onTouchStart?.(date, e)}
      onTouchEnd={(e) => onTouchEnd?.(date, e)}
      whileTap={{ scale: 0.95 }}
      data-date={formatDateSafe(date)}
      className={`relative flex w-full touch-none select-none flex-col rounded-md border p-0.5 transition-all focus:outline-none focus:ring-1 focus:ring-red-200 sm:rounded-lg sm:p-1 md:aspect-square ${bg} ${today ? 'bg-white/90 ring-2 ring-red-200' : ''} ${!inMonth ? 'opacity-40' : ''} ${isSelected ? 'bg-white/90 ring-2 ring-red-100' : 'hover:bg-white/80'} `}
      aria-label={`${format(date, 'yyyy-MM-dd')}, ${events.length}개의 일정${holiday ? `, ${holiday.name}` : ''}`}
    >
      {/* 날짜 숫자 */}
      <div className="mb-0.5 flex w-full items-center justify-between">
        <span
          className={`text-[11px] font-semibold sm:text-xs ${textColor} ${today ? 'rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-1.5 py-0.5 text-[10px] text-black sm:text-xs' : ''}`}
        >
          {dayNumber}
        </span>
      </div>

      {/* 공휴일 이름 */}
      {holiday && inMonth && (
        <div className="mb-0.5 w-full truncate text-left text-[9px] font-semibold leading-tight text-red-600 sm:text-xs">
          {holiday.name}
        </div>
      )}

      {/* 이벤트 */}
      <div className="flex w-full flex-1 flex-col gap-0.5 overflow-hidden">
        {events.slice(0, 2).map((ev: EventItem) => {
          const colorIndex = ev.color ? parseInt(ev.color) : 0;
          const colors = getEventColor(colorIndex);

          return (
            <motion.div
              key={ev.id}
              layout
              className={`truncate rounded px-1 py-0.5 text-[9px] font-semibold sm:text-xs ${colors.bg} ${colors.text} leading-tight`}
              title={ev.title}
            >
              {ev.title}
            </motion.div>
          );
        })}
        {events.length > 2 && (
          <div className="px-1 text-[8px] text-slate-600 sm:text-[9px]">+{events.length - 2}</div>
        )}
      </div>
    </motion.button>
  );
}

export default memo(DayCellInner);
