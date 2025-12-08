import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  open: boolean;
  onClose: () => void;
  user: string | null;
  onLogout: () => void;
};

export default function UserMenu({ open, onClose, user, onLogout }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-10 z-50 flex w-auto min-w-24 flex-col gap-2.5 overflow-hidden rounded-2xl border border-white/20 bg-white/95 py-3 shadow-2xl backdrop-blur-xl"
        >
          {/* 사용자 정보 */}
          <div className="w-full rounded-xl px-4 text-center text-sm sm:text-base">
            <div className="font-medium">{user}</div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          {/* 메뉴 항목 */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full rounded-xl px-4 text-center text-sm font-medium sm:text-base"
          >
            로그아웃
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
