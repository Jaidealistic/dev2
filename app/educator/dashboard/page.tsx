import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/educator/DashboardStats';
import StudentList from '@/components/educator/StudentList';
import RecentActivity from '@/components/educator/RecentActivity';
import QuickActions from '@/components/educator/QuickActions';

export const metadata = {
  title: 'Educator Dashboard | LinguaAccess',
  description: 'Manage your students and track their progress',
};

export default async function EducatorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'EDUCATOR') {
    redirect('/login');
  }

  const userId = (session.user as any).id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Educator Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your students and track their learning progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <QuickActions />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              Statistics Overview
            </h2>
            <DashboardStats userId={userId} />
          </section>

          {/* Student List */}
          <section aria-labelledby="students-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="students-heading" className="text-2xl font-semibold text-foreground">
                My Students
              </h2>
            </div>
            <StudentList educatorId={userId} />
          </section>

          {/* Recent Activity */}
          <section aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="text-2xl font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <RecentActivity educatorId={userId} />
          </section>
        </div>
      </main>
    </div>
  );
}