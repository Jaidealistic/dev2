import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PlatformAnalytics from '@/components/admin/PlatformAnalytics';
import UserManagement from '@/components/admin/UserManagement';
import SystemHealth from '@/components/admin/SystemHealth';
import ContentModeration from '@/components/admin/ContentModeration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Admin Dashboard | LinguaAccess',
  description: 'Platform administration and monitoring',
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform administration and monitoring
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <PlatformAnalytics />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <SystemHealth />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}