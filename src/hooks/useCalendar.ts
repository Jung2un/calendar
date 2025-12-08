import { useMemo, useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';

export function useCalendar(initial = new Date()) {
  const [current, setCurrent] = useState<Date>(initial);

  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(current), { weekStartsOn: 0 });

  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    let day = start;
    while (day <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [start, end]);

  return {
    current,
    setCurrent,
    weeks,
  };
}
