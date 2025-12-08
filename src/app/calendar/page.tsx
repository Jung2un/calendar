'use client';

import React, { useState, useEffect } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventSidebar from '@/components/calendar/EventSidebar';
import EventModal from '@/components/calendar/EventModal';
import LoginModal from '@/components/calendar/LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useEventModal } from '@/hooks/useEventModal';
import { useHolidays } from '@/hooks/useHolidays';
import { loadEventsForUser, saveEventsForUser } from '@/utils/storage';
import { format } from 'date-fns';
import { IoClose } from 'react-icons/io5';
import { FcCalendar } from 'react-icons/fc';
import { EventItem } from '@/types/event';
import { getColorIndexFromString } from '@/utils/colors';

export default function CalendarPage() {
  const { current, setCurrent, weeks } = useCalendar(new Date());
  const auth = useAuth();
  const modal = useEventModal();
  const [loginOpen, setLoginOpen] = useState(false);
  const [transitionDir, setTransitionDir] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 공휴일 데이터 가져오기
  const { holidays, loading } = useHolidays(current.getFullYear());

  const [events, setEvents] = useState<EventItem[]>(() => []);

  useEffect(() => {
    if (!auth.user) return;
    const loaded = loadEventsForUser(auth.user);
    if (loaded.length === 0) {
      const eventId = 'ev_a';
      const colorIndex = getColorIndexFromString(eventId);
      const sample: EventItem[] = [
        {
          id: eventId,
          user: auth.user,
          title: '🐰 제목 예시',
          notes: '✍️ 한 줄 메모 예시',
          date: format(new Date(), 'yyyy-MM-dd'),
          createdAt: new Date().toISOString(),
          color: colorIndex.toString(),
        },
      ];
      setEvents(sample);
      saveEventsForUser(auth.user, sample);
    } else {
      // 기존 이벤트에 색상이 없으면 추가
      const updatedEvents = loaded.map((event) => {
        if (!event.color) {
          const colorIndex = getColorIndexFromString(event.id);
          return { ...event, color: colorIndex.toString() };
        }
        return event;
      });
      setEvents(updatedEvents);
      if (updatedEvents !== loaded) {
        saveEventsForUser(auth.user, updatedEvents);
      }
    }
  }, [auth.user]);

  useEffect(() => {
    if (!auth.user) return;
    saveEventsForUser(auth.user, events);
  }, [events, auth.user]);

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
    if (!auth.user) {
      setLoginOpen(true);
      return;
    }
    modal.openFor(d);
  }

  function handleMultiDaySelect(startDate: Date, endDate: Date) {
    if (!auth.user) {
      setLoginOpen(true);
      return;
    }
    // 다중 날짜 선택 시 시작 날짜로 모달 열기
    modal.openFor(startDate, endDate);
  }

  function handleSaveEvent(ev: EventItem | EventItem[]) {
    if (Array.isArray(ev)) {
      // 다중 이벤트 저장
      setEvents((prev) => [...prev, ...ev].sort((a, b) => a.date.localeCompare(b.date)));
    } else {
      // 단일 이벤트 저장
      setEvents((prev) => [...prev, ev].sort((a, b) => a.date.localeCompare(b.date)));
    }
  }

  function handleUpdateEvent(updatedEvent: EventItem) {
    setEvents((prev) => {
      // 그룹 이벤트인 경우 같은 그룹의 모든 이벤트 업데이트
      if (updatedEvent.groupId) {
        return prev
          .map((event) => {
            if (event.groupId === updatedEvent.groupId) {
              return {
                ...event,
                title: updatedEvent.title,
                notes: updatedEvent.notes,
              };
            }
            return event;
          })
          .sort((a, b) => a.date.localeCompare(b.date));
      } else {
        // 단일 이벤트인 경우
        return prev
          .map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
          .sort((a, b) => a.date.localeCompare(b.date));
      }
    });
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handleDeleteAll() {
    const currentMonthStr = format(current, 'yyyy-MM');
    setEvents((prev) => prev.filter((e) => !e.date.startsWith(currentMonthStr)));
  }

  const currentMonthEvents = events.filter((e) => e.date.startsWith(format(current, 'yyyy-MM')));
  // bg-gradient-to-b from-white via-[#fff1f3] to-white
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex-shrink-0 p-3 sm:p-4">
          <CalendarHeader
            current={current}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            user={auth.user}
            onLoginClick={() => setLoginOpen(true)}
            onLogout={auth.logout}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-4 lg:flex-row">
          {/* 캘린더 영역 */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-3 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-4">
            {/* 요일 헤더 */}
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

            {/* 캘린더 그리드 */}
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

            {/* 공휴일 로딩 상태 */}
            {loading && (
              <div className="mt-2 flex-shrink-0 text-center text-xs text-slate-500">
                공휴일 정보 로딩 중...
              </div>
            )}
          </div>

          {/* 모바일: 플로팅 버튼 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/40 shadow-2xl backdrop-blur-xl active:scale-95 lg:hidden"
          >
            <span className="text-2xl">
              {sidebarOpen ? <IoClose size={22} /> : <FcCalendar size={20} />}
            </span>
          </button>

          {/* 사이드바 영역 */}
          <div
            className={`fixed inset-0 z-30 lg:relative lg:inset-auto lg:z-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}
          >
            {/* 모바일 배경 오버레이 */}
            {sidebarOpen && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* 사이드바 컨텐츠 */}
            <div
              className={`absolute right-0 top-0 h-full w-[85%] transform transition-transform duration-300 ease-in-out sm:w-80 lg:relative lg:w-80 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
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

        {/* 모달들 */}
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

        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLogin={(v: string) => auth.login(v)}
        />
      </div>
    </div>
  );
}
