import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { EventItem } from '@/types/event';

// 이벤트 조회
export function useEvents(year: number, month: number) {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['events', year, month],
    queryFn: async () => {
      const response = await fetch(`/api/events?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json() as Promise<EventItem[]>;
    },
    enabled: !!session, // 인증된 사용자만 이벤트 조회
  });
}

// 이벤트 생성
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      notes?: string;
      date: string;
      color?: string;
      groupId?: string;
      startDate?: string;
      endDate?: string;
      events?: any[];
    }) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// 이벤트 삭제
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// 이벤트 수정
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      notes?: string;
      date: string;
      color?: string;
    }) => {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
