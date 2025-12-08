import { useEffect, useState } from 'react';

export type Holiday = {
  date: string; // yyyy-MM-dd
  name: string;
  isHoliday: boolean;
};

export function useHolidays(year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHolidays() {
      setLoading(true);
      try {
        const serviceKey = process.env.NEXT_PUBLIC_HOLIDAY_API_KEY;
        if (!serviceKey) {
          setLoading(false);
          return;
        }

        // 공휴일 정보 API
        const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&numOfRows=100&_type=json&serviceKey=${encodeURIComponent(serviceKey)}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ 에러 응답 내용:', errorText);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.response?.header?.resultCode !== '00') {
          console.error('❌ 공휴일 API 에러:', data.response?.header?.resultMsg);
          setLoading(false);
          return;
        }

        const items = data.response?.body?.items?.item;

        if (!items) {
          setLoading(false);
          return;
        }

        const holidayList: Holiday[] = Array.isArray(items)
          ? items.map((item: any) => {
              const dateStr = String(item.locdate);
              const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
              return {
                date: formattedDate,
                name: item.dateName,
                isHoliday: item.isHoliday === 'Y',
              };
            })
          : [
              {
                date: (() => {
                  const dateStr = String(items.locdate);
                  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
                })(),
                name: items.dateName,
                isHoliday: items.isHoliday === 'Y',
              },
            ];
        console.table(holidayList);
        setHolidays(holidayList);
      } catch (error) {
        console.error('❌ 공휴일 API 호출 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHolidays();
  }, [year]);

  return { holidays, loading };
}
