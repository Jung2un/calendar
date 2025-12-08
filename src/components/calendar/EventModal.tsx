import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import { format } from 'date-fns';
import { uid } from '@/lib/uid';
import { EventItem } from '@/types/event';

type Props = {
  open: boolean;
  onClose: () => void;
  targetDate: Date | null;
  endDate?: Date | null;
  editingEvent?: EventItem | null;
  isEditMode?: boolean;
  onSave: (event: EventItem) => void;
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
      setTitle(editingEvent.title);
      setNotes(editingEvent.notes || '');
    } else {
      setTitle('');
      setNotes('');
    }
  }, [isEditMode, editingEvent, open]);

  function handleSave() {
    if (!targetDate) return;

    // 수정 모드
    if (isEditMode && editingEvent && onUpdate) {
      onUpdate({
        ...editingEvent,
        title: title || 'Untitled',
        notes,
      });
      onClose();
      return;
    }

    // 다중 날짜 선택 - 1개의 이벤트로 등록
    if (endDate && endDate !== targetDate) {
      const start = targetDate < endDate ? targetDate : endDate;
      const end = targetDate < endDate ? endDate : targetDate;
      const groupId = uid('group_');

      const event: EventItem = {
        id: uid('ev_'),
        title: title || 'Untitled',
        notes,
        date: format(start, 'yyyy-MM-dd'), // 시작 날짜를 대표 날짜로
        groupId,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
        color: String(Math.floor(Math.random() * 5)),
      };

      onSave(event);
    } else {
      // 단일 날짜
      const event: EventItem = {
        id: uid('ev_'),
        title: title || 'Untitled',
        notes,
        date: format(targetDate, 'yyyy-MM-dd'),
        color: String(Math.floor(Math.random() * 5)),
      };

      onSave(event);
    }

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <h3 className="mb-2 text-lg font-semibold">{isEditMode ? '일정 수정' : '일정 추가'}</h3>
        <div className="mb-3 text-xs opacity-70">
          {isEditMode && editingEvent
            ? format(new Date(editingEvent.date), 'yyyy년 M월 d일')
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
          autoFocus
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
