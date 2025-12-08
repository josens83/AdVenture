'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with zustand persist
const Game = dynamic(() => import('@/components/game/Game'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-dark-400">게임을 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return <Game />;
}
