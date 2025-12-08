# [Calendar](https://s-manage.vercel.app/calendar)

## Overview

개인 일정 관리 웹 애플리케이션입니다. React 19와 Next.js 16을 기반으로 구축되었으며, 직관적인 인터페이스와 반응형 디자인을 제공합니다.

사용자 인증 및 세션 관리가 가능하며, Prisma와 Supabase를 통해 이벤트 데이터가 안전하게 DB에 저장·관리됩니다.

### 주요 기능

- NextAuth 기반 사용자 인증 (로그인/회원가입 지원)
- Prisma + Supabase DB 연동을 통한 일정 저장
- 공휴일 자동 표시
- 월별 달력 화면 제공
- 모바일 반응형 UI 지원
- 일정 생성·수정·삭제 가능
- 여러 날짜에 걸친 일정 지원
- 드래그 & 드롭으로 날짜 범위 선택
- 로그인 여부에 따른 기능 제어 (비로그인 시 로그인 모달 표시)

## Getting Started

### Install dependencies

```bash
git clone <repository-url>
cd 프로젝트명
pnpm install
pnpm dev
```

## Folder Structure

```
src/
├── app/
│   ├── calendar/               # 캘린더 페이지
│   ├── globals.css             # 전역 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 홈페이지 (리다이렉트)
├── components/
│   ├── calendar/               # 캘린더 관련 컴포넌트
│   │   ├── CalendarGrid.tsx    # 캘린더 그리드
│   │   ├── CalendarHeader.tsx  # 캘린더 헤더
│   │   ├── DayCell.tsx         # 날짜 셀
│   │   ├── EventModal.tsx      # 일정 모달
│   │   ├── EventSidebar.tsx    # 일정 사이드바
│   │   └── LoginModal.tsx      # 로그인 모달
│   └── common/
│       ├── Modal.tsx           # 기본 모달
│       └── UserMenu.tsx        # 사용자 메뉴
├── hooks/
│   ├── useAuth.ts              # 인증 관리
│   ├── useCalendar.ts          # 캘린더 로직
│   ├── useDragSelection.ts     # 드래그 선택
│   ├── useEventModal.ts        # 이벤트 모달 상태
│   └── useHolidays.ts          # 공휴일 데이터
├── lib/
│   ├── motionVariants.ts       # Framer Motion 애니메이션
│   ├── queryClient.ts          # React Query 설정
│   ├── queryProvider.tsx       # Query Provider
│   └── uid.ts                  # 고유 ID 생성
├── types/
│   └── event.ts           # 이벤트 타입
└── utils/
    ├── colors.ts          # 색상 관리
    ├── dateUtils.ts       # 날짜 유틸리티
    └── storage.ts         # 로컬 스토리지 관리
```

## Tech Stack

![](https://img.shields.io/badge/node-ffffff?style=flat&logo=Node.js)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=ffffff)
![](https://img.shields.io/badge/next.js-000000?style=flat&logo=nextdotjs&logoColor=ffffff)
![](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![](https://img.shields.io/badge/Tailwind_CSS-grey?style=flat&logo=tailwind-css&logoColor=38B2AC)
![](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=TanStack&logoColor=ffffff)
![](https://img.shields.io/badge/supabase-black?style=flat&logo=supabase)
![](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)
![](https://img.shields.io/badge/framer_motion-ffca28?style=flat&logo=framer&logoColor=%23ffffff&color=%237178f6)
![](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=ESLint&logoColor=ffffff)
![](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=Prettier&logoColor=ffffff)
