'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, LogOut, User, GraduationCap, Home, School } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinguaAccess
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{session?.user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back to your learning journey.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100 bg-blue-50/50">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Resume your last lesson</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Resume Lesson 1.2</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Course Library</CardTitle>
                <CardDescription>Browse all available courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Browse Courses</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <School className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>My Progress</CardTitle>
                <CardDescription>View your achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Report</Button>
              </CardContent>
            </Card>

            {/* Role Specific */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-100 bg-orange-50/50">
              <CardHeader>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Home className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Homeschool Hub</CardTitle>
                <CardDescription>Access homeschool resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-100">Access Hub</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
