import { useState } from "react";
import { EventItem } from "../types/event";

export function useEventModal() {
  const [open, setOpen] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  function openFor(date: Date, end?: Date) {
    setTargetDate(date);
    setEndDate(end || null);
    setEditingEvent(null);
    setIsEditMode(false);
    setOpen(true);
  }

  function openForEdit(event: EventItem) {
    setEditingEvent(event);
    setIsEditMode(true);
    setTargetDate(null);
    setEndDate(null);
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
    openFor,
    openForEdit,
    close,
    targetDate,
    endDate,
    editingEvent,
    isEditMode,
  };
}
