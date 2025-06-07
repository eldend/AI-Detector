# 프론트엔드 개발 가이드

이 문서는 AI 악성프로세스 탐지 시스템의 프론트엔드 부분에 대한 상세한 개발 가이드를 제공합니다.

## 목차

1. [기술 스택](#기술-스택)
2. [디렉토리 구조](#디렉토리-구조)
3. [주요 컴포넌트](#주요-컴포넌트)
4. [상태 관리](#상태-관리)
5. [API 연동](#api-연동)
6. [스타일링](#스타일링)
7. [확장 및 커스터마이징](#확장-및-커스터마이징)

## 기술 스택

프론트엔드는 다음 기술을 사용하여 구현되었습니다:

- **Next.js**: React 프레임워크
- **TypeScript**: 타입 안전성을 위한 JavaScript 확장
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Framer Motion**: 애니메이션 라이브러리
- **Chart.js** (선택적): 데이터 시각화

## 디렉토리 구조

프론트엔드 프로젝트의 디렉토리 구조는 다음과 같습니다:

```
frontend/
├── public/              # 정적 파일
├── src/
│   ├── app/             # Next.js 앱 라우터
│   │   ├── globals.css  # 전역 스타일
│   │   ├── layout.tsx   # 레이아웃 컴포넌트
│   │   └── page.tsx     # 메인 페이지
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── EventDetail.tsx  # 이벤트 상세 정보 컴포넌트
│   │   ├── EventTable.tsx   # 이벤트 테이블 컴포넌트
│   │   ├── Header.tsx       # 헤더 컴포넌트
│   │   └── StatCard.tsx     # 통계 카드 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 유틸리티 함수
│   │   └── mockData.ts  # 목업 데이터
│   ├── services/        # API 서비스
│   └── types/           # TypeScript 타입 정의
│       └── event.ts     # 이벤트 관련 타입
├── next.config.js       # Next.js 설정
├── package.json         # 프로젝트 의존성
├── postcss.config.js    # PostCSS 설정
├── tailwind.config.js   # Tailwind CSS 설정
└── tsconfig.json        # TypeScript 설정
```

## 주요 컴포넌트

### 1. 메인 페이지 (page.tsx)

메인 페이지는 애플리케이션의 진입점으로, 대시보드 레이아웃과 주요 컴포넌트들을 포함합니다.

```tsx
// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import EventTable from '@/components/EventTable';
import EventDetail from '@/components/EventDetail';
import { Event, EventDetail as EventDetailType } from '@/types/event';
import { mockEvents, mockStats, mockEventDetail } from '@/lib/mockData';

export default function Home() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [stats, setStats] = useState(mockStats);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailType | null>(null);

  // 이벤트 선택 핸들러
  const handleEventSelect = (event: Event) => {
    // 실제 API 연동 시 이벤트 ID로 상세 정보를 가져오는 로직 구현
    setSelectedEvent(mockEventDetail);
  };

  // 데이터 새로고침 핸들러
  const handleRefresh = () => {
    // 실제 API 연동 시 데이터를 다시 가져오는 로직 구현
    setEvents([...mockEvents]);
    setStats({...mockStats});
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <Header onRefresh={handleRefresh} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Event" 
          value={stats.totalEvents.toString()} 
          icon="📊" 
          bgColor="bg-blue-500" 
        />
        <StatCard 
          title="Anomalies" 
          value={stats.anomalies.toString()} 
          icon="⚠️" 
          bgColor="bg-purple-500" 
        />
        <StatCard 
          title="Average Anomaly" 
          value={stats.avgAnomaly.toString()} 
          icon="📈" 
          bgColor="bg-cyan-500" 
        />
        <StatCard 
          title="Highest Score" 
          value={stats.highestScore.toString()} 
          icon="🖥️" 
          bgColor="bg-red-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <EventTable events={events} onEventSelect={handleEventSelect} />
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          {selectedEvent ? (
            <EventDetail eventDetail={selectedEvent} />
          ) : (
            <p className="text-center text-gray-400 mt-10">
              이벤트를 선택하여 상세 정보를 확인하세요
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
```

### 2. 이벤트 테이블 (EventTable.tsx)

이벤트 목록을 표시하는 테이블 컴포넌트입니다.

```tsx
// src/components/EventTable.tsx
'use client';

import { useState } from 'react';
import { Event } from '@/types/event';
import { motion } from 'framer-motion';

interface EventTableProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

export default function EventTable({ events, onEventSelect }: EventTableProps) {
  const [sortField, setSortField] = useState<keyof Event>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Event) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Timestamp</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th 
                className="p-3 cursor-pointer" 
                onClick={() => handleSort('timestamp')}
              >
                TIMESTAMP {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-3">USER</th>
              <th className="p-3">ANOMALY</th>
              <th className="p-3">LABEL</th>
              <th className="p-3">EVENT</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-t border-gray-700 cursor-pointer hover:bg-gray-700 ${
                  event.label === 'Anomaly' ? 'bg-gray-750' : ''
                }`}
                onClick={() => onEventSelect(event)}
              >
                <td className="p-3">{event.timestamp}</td>
                <td className="p-3">{event.user}</td>
                <td className="p-3">{event.anomaly}</td>
                <td className="p-3">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.label === 'Anomaly' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {event.label}
                  </span>
                </td>
                <td className="p-3">{event.event}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 3. 이벤트 상세 정보 (EventDetail.tsx)

선택한 이벤트의 상세 정보를 표시하는 컴포넌트입니다.

```tsx
// src/components/EventDetail.tsx
'use client';

import { motion } from 'framer-motion';
import { EventDetail as EventDetailType } from '@/types/event';

interface EventDetailProps {
  eventDetail: EventDetailType;
}

export default function EventDetail({ eventDetail }: EventDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Event Detail</h2>
        <span className="text-sm text-gray-400">{eventDetail.date}</span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg mb-2">Anomaly Score</h3>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-blue-400"
          >
            {eventDetail.anomalyScore}
          </motion.div>
          <span 
            className={`px-3 py-1 rounded-full ${
              eventDetail.anomalyScore > 0.5 
                ? 'bg-red-500 text-white' 
                : 'bg-indigo-500 text-white'
            }`}
          >
            {eventDetail.anomalyScore > 0.5 ? 'Anomaly' : 'Normal'}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${eventDetail.anomalyScore * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`h-2 rounded-full ${
              eventDetail.anomalyScore > 0.7 
                ? 'bg-red-500' 
                : eventDetail.anomalyScore > 0.4 
                  ? 'bg-yellow-500' 
                  : 'bg-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg mb-2">Incident</h3>
        <p className="text-gray-300">{eventDetail.incident}</p>
      </div>

      <div>
        <h3 className="text-lg mb-2">Row Data</h3>
        <div className="bg-gray-900 rounded p-4 font-mono text-sm">
          {Object.entries(eventDetail.rowData).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="text-blue-400">{key}</span>
              <span className="text-gray-400">: </span>
              <span className="text-green-400">"{value}"</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
        >
          Ignore
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Take Action
        </motion.button>
      </div>
    </motion.div>
  );
}
```

### 4. 통계 카드 (StatCard.tsx)

대시보드 상단에 표시되는 통계 카드 컴포넌트입니다.

```tsx
// src/components/StatCard.tsx
'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
}

export default function StatCard({ title, value, icon, bgColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${bgColor} rounded-lg p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="text-4xl font-bold mt-4"
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
```

### 5. 헤더 (Header.tsx)

애플리케이션 상단에 표시되는 헤더 컴포넌트입니다.

```tsx
// src/components/Header.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onRefresh: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-purple-400"
      >
        AI Detector
      </motion.h1>
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          )}
          Refresh Data
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </motion.button>
      </div>
    </header>
  );
}
```

## 상태 관리

현재 구현에서는 React의 기본 상태 관리 기능인 `useState`와 `useEffect`를 사용하여 상태를 관리합니다. 애플리케이션이 복잡해지면 다음과 같은 상태 관리 라이브러리를 고려할 수 있습니다:

- **React Context API**: 간단한 전역 상태 관리
- **Redux**: 복잡한 상태 관리와 미들웨어 지원
- **Zustand**: 간결하고 사용하기 쉬운 상태 관리
- **Jotai/Recoil**: 원자적 상태 관리

## API 연동

백엔드 API와 연동하려면 다음과 같은 서비스 함수를 구현할 수 있습니다:

```tsx
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function fetchEventDetail(id: number) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event detail');
  }
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/events/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}
```

그리고 이를 컴포넌트에서 다음과 같이 사용할 수 있습니다:

```tsx
// src/app/page.tsx (일부)
import { fetchEvents, fetchStats, fetchEventDetail } from '@/services/api';

// ...

useEffect(() => {
  async function loadData() {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
      
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // 에러 처리 로직
    }
  }
  
  loadData();
}, []);

const handleEventSelect = async (event: Event) => {
  try {
    const eventDetail = await fetchEventDetail(event.id);
    setSelectedEvent(eventDetail);
  } catch (error) {
    console.error('Error loading event detail:', error);
    // 에러 처리 로직
  }
};
```

## 스타일링

프로젝트는 Tailwind CSS를 사용하여 스타일링됩니다. 주요 스타일링 파일은 다음과 같습니다:

- **globals.css**: 전역 스타일 및 Tailwind 지시어
- **tailwind.config.js**: Tailwind 설정 및 테마 커스터마이징

### 테마 커스터마이징

Tailwind 테마를 커스터마이징하려면 `tailwind.config.js` 파일을 수정합니다:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2D3748',
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... 더 많은 색상 추가
        },
        // 커스텀 색상 추가
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

## 확장 및 커스터마이징

### 새로운 컴포넌트 추가

새로운 컴포넌트를 추가하려면 `src/components` 디렉토리에 새 파일을 생성하고 컴포넌트를 구현합니다:

```tsx
// src/components/NewComponent.tsx
'use client';

import { useState } from 'react';

interface NewComponentProps {
  // 프롭스 정의
}

export default function NewComponent({ /* 프롭스 */ }: NewComponentProps) {
  // 상태 및 로직 구현
  
  return (
    <div>
      {/* 컴포넌트 UI */}
    </div>
  );
}
```

### 새로운 페이지 추가

Next.js 앱 라우터를 사용하여 새 페이지를 추가하려면 `src/app` 디렉토리에 새 폴더와 `page.tsx` 파일을 생성합니다:

```tsx
// src/app/new-page/page.tsx
'use client';

export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
      {/* 페이지 내용 */}
    </div>
  );
}
```

이 페이지는 `/new-page` URL로 접근할 수 있습니다.

### 데이터 시각화 추가

Chart.js를 사용하여 데이터 시각화를 추가할 수 있습니다:

1. 패키지 설치:
```bash
npm install chart.js react-chartjs-2
```

2. 차트 컴포넌트 생성:
```tsx
// src/components/AnomalyChart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnomalyChartProps {
  data: { timestamp: string; anomaly: number }[];
}

export default function AnomalyChart({ data }: AnomalyChartProps) {
  const chartData = {
    labels: data.map(item => item.timestamp),
    datasets: [
      {
        label: 'Anomaly Score',
        data: data.map(item => item.anomaly),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Anomaly Score Trend',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
```

3. 컴포넌트 사용:
```tsx
import AnomalyChart from '@/components/AnomalyChart';

// ...

<AnomalyChart data={events.map(e => ({ timestamp: e.timestamp, anomaly: e.anomaly }))} />
```

---

이 가이드는 프론트엔드 개발의 기본적인 측면을 다루고 있습니다. 추가 질문이나 도움이 필요하면 문의해주세요.

