import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardStats from '@/components/educator/DashboardStats';
import StudentList from '@/components/educator/StudentList';
import RecentActivity from '@/components/educator/RecentActivity';

import { redirect } from 'next/navigation';

export default async function EducatorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Educator Dashboard</h1>
        <p className="text-gray-600">Manage your students and track their progress</p>
      </div>

      <div className="space-y-8">
        <DashboardStats userId={session.user.id || ''} />
        <StudentList educatorId={session.user.id || ''} />
        <RecentActivity educatorId={session.user.id || ''} />
      </div>
    </div>
  );
}
