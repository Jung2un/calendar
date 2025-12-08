import React from 'react';
import { Providers } from './providers';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '일정관리',
  description: '개인 일정 관리 웹',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
