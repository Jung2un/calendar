import { useState } from 'react';
import { EventItem } from '@/types/event';

export function useEventModal() {
  const [open, setOpen] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  function openFor(date: Date) {
    setTargetDate(date);
    setEndDate(null);
    setEditingEvent(null);
    setIsEditMode(false);
    setOpen(true);
  }

  function openForMulti(startDate: Date, endDate: Date) {
    setTargetDate(startDate);
    setEndDate(endDate);
    setEditingEvent(null);
    setIsEditMode(false);
    setOpen(true);
  }

  function openForEdit(event: EventItem) {
    setTargetDate(new Date(event.date));
    setEndDate(null);
    setEditingEvent(event);
    setIsEditMode(true);
    setOpen(true);
  }

  function close() {
    setTargetDate(null);
    setEndDate(null);
    setEditingEvent(null);
    setIsEditMode(false);
    setOpen(false);
  }

  return {
    open,
    targetDate,
    endDate,
    editingEvent,
    isEditMode,
    openFor,
    openForMulti,
    openForEdit,
    close,
  };
}
