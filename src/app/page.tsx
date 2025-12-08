'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/calendar');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-purple-100">
      <div className="text-2xl font-semibold text-slate-800">Loading...</div>
    </div>
  );
}
