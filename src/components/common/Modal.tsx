import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '@/lib/motionVariants';

export default function Modal({ open, onClose, children }: any) {
  const ref = useRef<HTMLDivElement | null>(null);

  // ESC로 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // 모달 열리면 첫 input에 포커스 주기
  useEffect(() => {
    if (open) {
      const el = ref.current?.querySelector('input, textarea, button') as HTMLElement | null;
      el?.focus();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            ref={ref}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={fadeUp}
            className="z-10 w-[92%] rounded-xl bg-white/95 p-6 shadow-xl sm:w-[420px]"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
