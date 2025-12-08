import React from 'react';
import { EventItem } from '@/types/event';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FcCalendar } from 'react-icons/fc';
import { getEventColor } from '@/utils/colors';

type Props = {
  events: EventItem[];
  currentMonth: Date;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
  onDeleteAll?: () => void;
};

export default function EventSidebar({
  events,
  currentMonth,
  onEdit,
  onDelete,
  onDeleteAll,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-4 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">일정</h3>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 text-xs font-medium text-slate-900 sm:text-sm">
            {events.length}개
          </div>
          {events.length > 0 && onDeleteAll && (
            <button
              onClick={onDeleteAll}
              className="rounded-full px-2 py-1 text-xs font-medium transition sm:text-sm"
              title="전체 삭제"
            >
              전체삭제
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 sm:space-y-3 sm:pr-2">
        {events.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-600 sm:py-12 sm:text-sm">
            <div className="mt-1 text-xs text-slate-500">
              {format(currentMonth, 'M월', { locale: ko })} 일정이 없습니다.
            </div>
          </div>
        )}

        {events.map((ev: EventItem) => {
          const colorIndex = ev.color ? parseInt(ev.color) : 0;
          const colors = getEventColor(colorIndex);
          const isMultiDay = ev.startDate && ev.endDate && ev.startDate !== ev.endDate;

          return (
            <motion.div
              key={ev.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-xl border border-white/20 bg-white/50 p-3 backdrop-blur-sm transition hover:bg-white/60 sm:p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${colors.bg} ${colors.border} border`}
                    ></div>
                    <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                      {ev.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 sm:gap-2 sm:text-xs">
                    <span>
                      <FcCalendar size={12} />
                    </span>
                    {isMultiDay ? (
                      <span>
                        {format(new Date(ev.startDate!), 'M월 d일', { locale: ko })} ~{' '}
                        {format(new Date(ev.endDate!), 'M월 d일', { locale: ko })}
                      </span>
                    ) : (
                      <span>{format(new Date(ev.date), 'M월 d일 (EEE)', { locale: ko })}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-1">
                  <button
                    onClick={() => onEdit(ev)}
                    className="rounded-lg p-1 text-xs sm:p-1.5"
                    title="수정"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(ev.id)}
                    className="rounded-lg p-1 text-xs sm:p-1.5"
                    title="삭제"
                  >
                    삭제
                  </button>
                </div>
              </div>

              {ev.notes && (
                <div className="mt-2 break-words rounded-lg bg-white/30 p-2 text-xs text-slate-700 sm:text-sm">
                  {ev.notes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 border-t border-white/20 pt-3 sm:mt-4 sm:pt-4">
        <div className="text-center text-[10px] text-slate-600 sm:text-xs">
          💡 날짜를 클릭하여 일정을 추가하세요
        </div>
      </div>
    </div>
  );
}
