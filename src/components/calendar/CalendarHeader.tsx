import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { IoMenu } from "react-icons/io5";
import UserMenu from "@/components/common/UserMenu";
import { IoChevronBack } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";

export default function CalendarHeader({
  current,
  onPrev,
  onNext,
  onToday,
  user,
  onLoginClick,
  onLogout,
}: any) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4 px-2 gap-4 flex-wrap">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap tracking-tight">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          className="pr-2 sm:px-4 sm:py-1.5 font-semibold text-slate-800"
        >
          <IoChevronBack size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900"
        >
          {format(current, "yyyy년 M월")}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="pl-2 sm:px-4 sm:py-1.5 font-semibold text-slate-800"
        >
          <IoChevronForward size={20} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToday}
          className="px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-xl bg-white/30 hover:bg-white/50 transition font-semibold text-slate-700 text-sm sm:text-base tracking-tight"
        >
          오늘
        </motion.button>
      </div>

      <div className="flex items-center gap-4 relative">
        {!user ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLoginClick}
            className="px-4 sm:px-6 text-black font-medium text-sm sm:text-base"
          >
            로그인
          </motion.button>
        ) : (
          <>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-end transition-shadow cursor-pointer"
            >
              <IoMenu size={20} />
            </button>

            <UserMenu
              open={userMenuOpen}
              onClose={() => setUserMenuOpen(false)}
              user={user}
              onLogout={onLogout}
            />
          </>
        )}
      </div>
    </div>
  );
}
