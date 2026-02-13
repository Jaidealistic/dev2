import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Navigation from '@/components/educator/Navigation';

export default async function EducatorLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
    </div>
  );
}
