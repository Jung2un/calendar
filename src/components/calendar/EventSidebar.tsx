import React from 'react';
import { EventItem } from '@/types/event';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FcCalendar } from 'react-icons/fc';
import { getEventColor } from '@/utils/colors';
import { parseDateSafe } from '@/utils/dateUtils';

type GroupedEvent = {
  id: string;
  title: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  color: string;
  eventIds: string[];
  isMultiDay: boolean;
};

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
  // 이벤트 그룹화
  function groupEvents(events: EventItem[]): GroupedEvent[] {
    const groups = new Map<string, EventItem[]>();
    const singleEvents: EventItem[] = [];

    // 그룹 ID가 있는 이벤트들을 그룹화
    events.forEach((event) => {
      if (event.groupId) {
        if (!groups.has(event.groupId)) {
          groups.set(event.groupId, []);
        }
        groups.get(event.groupId)!.push(event);
      } else {
        singleEvents.push(event);
      }
    });

    const result: GroupedEvent[] = [];

    // 그룹화된 이벤트들 처리
    groups.forEach((groupEvents, groupId) => {
      const sortedEvents = groupEvents.sort((a, b) => a.date.localeCompare(b.date));
      const firstEvent = sortedEvents[0];
      const lastEvent = sortedEvents[sortedEvents.length - 1];

      result.push({
        id: groupId,
        title: firstEvent.title,
        notes: firstEvent.notes,
        startDate: firstEvent.date,
        endDate: sortedEvents.length > 1 ? lastEvent.date : undefined,
        color: firstEvent.color || '0',
        eventIds: sortedEvents.map((e) => e.id),
        isMultiDay: sortedEvents.length > 1,
      });
    });

    // 단일 이벤트들 처리
    singleEvents.forEach((event) => {
      result.push({
        id: event.id,
        title: event.title,
        notes: event.notes,
        startDate: event.date,
        color: event.color || '0',
        eventIds: [event.id],
        isMultiDay: false,
      });
    });

    // 날짜순으로 정렬
    return result.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  const groupedEvents = groupEvents(events);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-4 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">일정</h3>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 text-xs font-medium text-slate-900 sm:text-sm">
            {groupedEvents.length}개
          </div>
          {groupedEvents.length > 0 && onDeleteAll && (
            <button
              onClick={() => {
                if (window.confirm('이번 달 모든 일정을 삭제하시겠습니까?')) {
                  onDeleteAll();
                }
              }}
              className="rounded-full px-2 py-1 text-xs font-medium transition sm:text-sm"
              title="전체 삭제"
            >
              전체삭제
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 sm:space-y-3 sm:pr-2">
        {groupedEvents.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-600 sm:py-12 sm:text-sm">
            <div className="mt-1 text-xs text-slate-500">
              {format(currentMonth, 'M월', { locale: ko })} 일정이 없습니다.
            </div>
          </div>
        )}

        {groupedEvents.map((groupedEvent: GroupedEvent) => {
          const colorIndex = parseInt(groupedEvent.color);
          const colors = getEventColor(colorIndex);

          return (
            <motion.div
              key={groupedEvent.id}
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
                      {groupedEvent.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 sm:gap-2 sm:text-xs">
                    <span>
                      <FcCalendar size={12} />
                    </span>
                    {groupedEvent.isMultiDay ? (
                      <span>
                        {(() => {
                          const startDate = parseDateSafe(groupedEvent.startDate);
                          const endDate = parseDateSafe(groupedEvent.endDate!);
                          return `${format(startDate, 'M월 d일', { locale: ko })} ~ ${format(endDate, 'M월 d일', { locale: ko })}`;
                        })()}
                      </span>
                    ) : (
                      <span>
                        {(() => {
                          const date = parseDateSafe(groupedEvent.startDate);
                          return format(date, 'M월 d일 (EEE)', { locale: ko });
                        })()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-1">
                  <button
                    onClick={() => {
                      // 그룹의 첫 번째 이벤트를 편집 대상으로 선택
                      const firstEvent = events.find((e) => groupedEvent.eventIds.includes(e.id));
                      if (firstEvent) {
                        onEdit(firstEvent);
                      }
                    }}
                    className="rounded-lg p-1 text-xs sm:p-1.5"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      groupedEvent.eventIds.forEach((id) => onDelete(id));
                    }}
                    className="rounded-lg p-1 text-xs sm:p-1.5"
                  >
                    삭제
                  </button>
                </div>
              </div>

              {groupedEvent.notes && (
                <div className="mt-2 break-words rounded-lg bg-white/30 p-2 text-xs text-slate-700 sm:text-sm">
                  {groupedEvent.notes}
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
