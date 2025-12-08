import React from 'react';
import QueryProvider from '@/lib/queryProvider';
import './globals.css';

export const metadata = {
  title: '일정관리',
  description: '개인 일정 관리 웹',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
