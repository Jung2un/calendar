import { useSession, signIn, signOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const prevAuthState = useRef<boolean | null>(null);

  // 인증 상태 변경 감지 및 쿼리 처리
  useEffect(() => {
    const isAuthenticated = !!session;

    // 로딩 중이 아니고, 이전 상태와 현재 상태가 다를 때만 처리
    if (
      status !== 'loading' &&
      prevAuthState.current !== null &&
      prevAuthState.current !== isAuthenticated
    ) {
      if (isAuthenticated) {
        // 로그인 시: 이벤트 쿼리 무효화하여 새 데이터 로드
        queryClient.invalidateQueries({ queryKey: ['events'] });
      } else {
        // 로그아웃 시: 이벤트 쿼리 캐시 완전 제거
        queryClient.removeQueries({ queryKey: ['events'] });
      }
    }

    // 로딩이 완료되면 현재 상태 저장
    if (status !== 'loading') {
      prevAuthState.current = isAuthenticated;
    }
  }, [session, status, queryClient]);

  return {
    user: session?.user?.email || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    login: async (email: string, password: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // 로그인 성공 시 이벤트 쿼리 무효화
      if (result?.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }

      return result;
    },
    logout: async () => {
      // 로그아웃 시 이벤트 쿼리 캐시 완전 제거
      queryClient.removeQueries({ queryKey: ['events'] });
      await signOut({ redirect: false });
    },
    signup: async (email: string, password: string, name?: string) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      return response.json();
    },
  };
}
