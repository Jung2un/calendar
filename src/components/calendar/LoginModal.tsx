import React, { useState } from 'react';
import Modal from '@/components/common/Modal';

export default function LoginModal({ open, onClose, onLogin }: any) {
  const [value, setValue] = useState('');

  function handleLogin() {
    if (value.trim()) {
      onLogin(value);
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="tracking-tight">
        <h3 className="mb-2 text-lg font-semibold">로그인</h3>
        <div className="mb-3 text-xs opacity-70">
          이메일을 입력하면 해당 이메일로 로컬에 저장됩니다.
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="you@example.com"
          className="mb-4 w-full rounded border p-2 tracking-wide focus:outline-none focus:ring-2 focus:ring-red-100"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 font-medium transition hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleLogin}
            className="rounded rounded-full border border-red-100 bg-red-50 px-4 py-2 font-medium transition"
          >
            로그인
          </button>
        </div>
      </div>
    </Modal>
  );
}
