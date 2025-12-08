import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import { format, differenceInDays } from 'date-fns';
import { uid } from '@/lib/uid';
import { EventItem } from '../../types/event';
import { getColorIndexFromString } from '../../utils/colors';
import { formatDateSafe, getDatesBetween, parseDateSafe } from '../../utils/dateUtils';

type Props = {
  open: boolean;
  onClose: () => void;
  targetDate: Date | null;
  endDate?: Date | null;
  editingEvent?: EventItem | null;
  isEditMode?: boolean;
  onSave: (event: EventItem | EventItem[]) => void;
  onUpdate?: (event: EventItem) => void;
};

export default function EventModal({
  open,
  onClose,
  targetDate,
  endDate,
  editingEvent,
  isEditMode = false,
  onSave,
  onUpdate,
}: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditMode && editingEvent) {
      // 수정 시 기존 이벤트 데이터로 폼 채우기
      setTitle(editingEvent.title);
      setNotes(editingEvent.notes || '');
    } else if (!isEditMode) {
      // 추가 시 폼 초기화
      setTitle('');
      setNotes('');
    }
  }, [isEditMode, editingEvent, targetDate]);

  function handleSave() {
    // 수정 모드
    if (isEditMode && editingEvent && onUpdate) {
      const updatedEvent: EventItem = {
        ...editingEvent,
        title: title || 'Untitled',
        notes,
      };
      onUpdate(updatedEvent);
      onClose();
      return;
    }

    // 새 일정 추가
    if (!targetDate) return;

    // 다중 날짜 선택인 경우
    if (endDate && endDate !== targetDate) {
      const start = targetDate < endDate ? targetDate : endDate;
      const end = targetDate < endDate ? endDate : targetDate;
      const groupId = uid('group_');
      const startDateStr = formatDateSafe(start);
      const endDateStr = formatDateSafe(end);
      const colorIndex = getColorIndexFromString(groupId);

      // 안전한 날짜 범위 계산
      const dateStrings = getDatesBetween(start, end);
      const events: EventItem[] = dateStrings.map((dateStr) => ({
        id: uid('ev_'),
        user: 'local',
        title: title || 'Untitled',
        notes,
        date: dateStr,
        createdAt: new Date().toISOString(),
        groupId,
        startDate: startDateStr,
        endDate: endDateStr,
        color: colorIndex.toString(),
      }));

      onSave(events);
    } else {
      // 단일 날짜 선택인 경우
      const dateStr = formatDateSafe(targetDate);
      const eventId = uid('ev_');
      const colorIndex = getColorIndexFromString(eventId);

      const ev: EventItem = {
        id: eventId,
        user: 'local',
        title: title || 'Untitled',
        notes,
        date: dateStr,
        createdAt: new Date().toISOString(),
        color: colorIndex.toString(),
      };
      onSave(ev);
    }

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="tracking-tight">
        <h3 className="mb-2 text-lg font-semibold">{isEditMode ? '일정 수정' : '일정 추가'}</h3>
        <div className="mb-3 text-xs opacity-70">
          {isEditMode && editingEvent
            ? (() => {
                const date = parseDateSafe(editingEvent.date);
                return format(date, 'yyyy년 M월 d일');
              })()
            : targetDate && endDate && endDate !== targetDate
              ? `${format(targetDate < endDate ? targetDate : endDate, 'yyyy년 M월 d일')} ~ ${format(targetDate < endDate ? endDate : targetDate, 'yyyy년 M월 d일')}`
              : targetDate
                ? format(targetDate, 'yyyy년 M월 d일')
                : ''}
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="mb-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-red-100"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="메모 (선택)"
          className="mb-4 h-24 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-red-100"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded px-4 py-2 transition hover:bg-gray-100">
            취소
          </button>
          <button
            onClick={handleSave}
            className="rounded rounded-full border border-red-100 bg-red-50 px-4 py-2 transition"
          >
            {isEditMode ? '수정' : '저장'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
