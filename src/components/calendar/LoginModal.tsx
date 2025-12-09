import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/hooks/useAuth';

function translateError(error: string): string {
  const errorMap: { [key: string]: string } = {
    // NextAuth 에러
    CredentialsSignin: '이메일 또는 비밀번호가 올바르지 않습니다.',
    Configuration: '서버 설정 오류가 발생했습니다.',
    AccessDenied: '접근이 거부되었습니다.',
    Verification: '인증에 실패했습니다.',

    // 일반 에러
    'Invalid credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'User not found': '사용자를 찾을 수 없습니다.',
    'Incorrect password': '비밀번호가 올바르지 않습니다.',
    'Email already exists': '이미 사용 중인 이메일입니다.',
    'Invalid email': '유효하지 않은 이메일 형식입니다.',
    'Password too short': '비밀번호가 너무 짧습니다.',
    'Network error': '네트워크 오류가 발생했습니다.',
    'Server error': '서버 오류가 발생했습니다.',
  };

  // 에러 메시지에 키워드가 포함되어 있는지 확인
  for (const [key, translation] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return translation;
    }
  }

  // 기본 메시지
  return '로그인에 실패했습니다. 다시 시도해주세요.';
}

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  useEffect(() => {
    if (open) {
      setEmail('');
      setPassword('');
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, name);
        // 회원가입 후 자동 로그인
        await login(email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <h3 className="mb-2 text-lg font-semibold">{isSignup ? '회원가입' : '로그인'}</h3>
        <div className="mb-3 text-xs opacity-70">
          {isSignup ? '새 계정을 만들어 일정을 관리하세요.' : '계정에 로그인하세요.'}
        </div>

        <form onSubmit={handleSubmit}>
          {/* {isSignup && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 (선택)"
              className="mb-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          )} */}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            className="mb-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-red-100"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className="mb-4 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-red-100"
          />

          {error && (
            <div className="mb-3 rounded bg-red-100 p-2 text-sm text-red-600">
              {translateError(error)}
            </div>
          )}

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-sm text-slate-800 hover:underline"
            >
              {isSignup ? '로그인' : '회원가입'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-4 py-2 transition hover:bg-gray-100"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-full border border-red-100 bg-red-50 px-4 py-2 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '처리 중...' : isSignup ? '가입하기' : '로그인'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
