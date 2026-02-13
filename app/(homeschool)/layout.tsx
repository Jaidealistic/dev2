import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import HomeschoolNav from '@/components/homeschool/HomeschoolNav';

export default async function HomeschoolLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'PARENT_EDUCATOR') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeschoolNav />
      {children}
    </div>
  );
}
