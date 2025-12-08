import { easeOut } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } },
  exit: { opacity: 0, y: 0, transition: { duration: 0.18 } },
};

export const slideX = (dir = 1) => ({
  hidden: { opacity: 0, x: 30 * dir },
  show: { opacity: 1, x: 0, transition: { duration: 0.36, ease: easeOut } },
  exit: { opacity: 0, x: -20 * dir, transition: { duration: 0.24 } },
});
