import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import PlatformAnalytics from '@/components/admin/PlatformAnalytics';
import UserManagement from '@/components/admin/UserManagement';
import SystemHealth from '@/components/admin/SystemHealth';
import ContentModeration from '@/components/admin/ContentModeration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Dashboard | LexFix',
  description: 'Platform administration and monitoring',
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

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