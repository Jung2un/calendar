'use client';

import React, { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventSidebar from '@/components/calendar/EventSidebar';
import EventModal from '@/components/calendar/EventModal';
import LoginModal from '@/components/calendar/LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useEventModal } from '@/hooks/useEventModal';
import { useHolidays } from '@/hooks/useHolidays';
import { useEvents, useCreateEvent, useDeleteEvent, useUpdateEvent } from '@/hooks/useEvents';
import { EventItem } from '@/types/event';
import { format } from 'date-fns';
import { FcCalendar } from 'react-icons/fc';
import { IoClose } from 'react-icons/io5';

export default function CalendarPage() {
  const { current, setCurrent, weeks } = useCalendar(new Date());
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const modal = useEventModal();
  const [loginOpen, setLoginOpen] = useState(false);
  const [transitionDir, setTransitionDir] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 공휴일 및 이벤트 데이터
  const { holidays, loading: holidaysLoading } = useHolidays(current.getFullYear());
  const { data: events = [], isLoading: eventsLoading } = useEvents(
    current.getFullYear(),
    current.getMonth()
  );

  // Mutations
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();

  function handlePrev() {
    setTransitionDir(-1);
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  function handleNext() {
    setTransitionDir(1);
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  function handleToday() {
    setTransitionDir(1);
    setCurrent(new Date());
  }

  function handleDayClick(d: Date) {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    modal.openFor(d);
  }

  // 다중 날짜 선택 처리
  function handleMultiDaySelect(startDate: Date, endDate: Date) {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    modal.openForMulti(startDate, endDate);
  }

  function handleSaveEvent(ev: EventItem) {
    // 단일/그룹 이벤트 모두 1개로 생성
    createEvent.mutate({
      title: ev.title,
      notes: ev.notes,
      date: ev.date,
      color: ev.color,
      groupId: ev.groupId,
      startDate: ev.startDate,
      endDate: ev.endDate,
    });
  }

  function handleUpdateEvent(updatedEvent: EventItem) {
    // 그룹 이벤트인 경우 같은 그룹의 모든 이벤트 업데이트
    if (updatedEvent.groupId) {
      const groupEvents = events.filter((e) => e.groupId === updatedEvent.groupId);
      groupEvents.forEach((event) => {
        updateEvent.mutate({
          id: event.id,
          title: updatedEvent.title,
          notes: updatedEvent.notes,
          date: event.date,
          color: event.color,
        });
      });
    } else {
      // 단일 이벤트인 경우
      updateEvent.mutate({
        id: updatedEvent.id,
        title: updatedEvent.title,
        notes: updatedEvent.notes,
        date: updatedEvent.date,
        color: updatedEvent.color,
      });
    }
  }

  function handleDelete(id: string) {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      deleteEvent.mutate(id);
    }
  }

  function handleDeleteAll() {
    if (window.confirm('이번 달 모든 일정을 삭제하시겠습니까?')) {
      const currentMonthStr = format(current, 'yyyy-MM');
      const eventsToDelete = events.filter((e) => e.date.startsWith(currentMonthStr));

      // 모든 이벤트 삭제
      eventsToDelete.forEach((event) => {
        deleteEvent.mutate(event.id);
      });
    }
  }

  // 로그아웃 처리
  async function handleLogout() {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();

        setSidebarOpen(false);
        modal.close();
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
      }
    }
  }

  const currentMonthEvents = events.filter((e) => e.date.startsWith(format(current, 'yyyy-MM')));

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-white via-[#fff1f3] to-white">
        <div className="text-xl font-semibold text-slate-800">Loading...</div>
      </div>
    );
  }

  // bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-white via-[#fff1f3] to-white">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col overflow-hidden">
        <div className="flex-shrink-0 p-3 sm:p-4">
          <CalendarHeader
            current={current}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            user={user}
            onLoginClick={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-4 lg:flex-row">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-3 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-4">
            <div className="mb-2 grid flex-shrink-0 grid-cols-7 text-center text-[11px] font-semibold sm:mb-3 sm:text-sm">
              {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                <div
                  key={d}
                  className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-800'}`}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-0.5 py-3">
              <CalendarGrid
                weeks={weeks}
                currentMonth={current}
                events={events}
                holidays={holidays}
                onDayClick={handleDayClick}
                onMultiDaySelect={handleMultiDaySelect}
                transitionDir={transitionDir}
              />
            </div>

            {/* {(holidaysLoading || eventsLoading) && (
            <div className="mt-2 flex-shrink-0 text-center text-xs text-slate-500">
              데이터 로딩 중...
            </div>
          )} */}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/40 shadow-2xl backdrop-blur-xl active:scale-95 lg:hidden"
          >
            <span className="text-2xl">
              {sidebarOpen ? <IoClose size={22} /> : <FcCalendar size={20} />}
            </span>
          </button>

          <div
            className={`fixed inset-0 z-30 lg:relative lg:inset-auto lg:z-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}
          >
            {sidebarOpen && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div
              className={`absolute right-0 top-0 h-full w-[85%] transform transition-transform duration-300 ease-in-out sm:w-80 lg:relative lg:w-80 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
            >
              <EventSidebar
                events={currentMonthEvents}
                currentMonth={current}
                onEdit={(event: EventItem) => {
                  modal.openForEdit(event);
                  setSidebarOpen(false);
                }}
                onDelete={handleDelete}
                onDeleteAll={handleDeleteAll}
              />
            </div>
          </div>
        </div>

        <EventModal
          open={modal.open}
          onClose={modal.close}
          targetDate={modal.targetDate}
          endDate={modal.endDate}
          editingEvent={modal.editingEvent}
          isEditMode={modal.isEditMode}
          onSave={handleSaveEvent}
          onUpdate={handleUpdateEvent}
        />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    </div>
  );
}
