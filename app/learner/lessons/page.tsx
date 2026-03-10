import { Suspense } from 'react';
import LessonsClient from './LessonsClient';

export const dynamic = 'force-dynamic';

export default function LessonsListPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#faf9f7] text-[#6b6b6b]">Loading Lessons...</div>}>
      <LessonsClient />
    </Suspense>
  );
}
