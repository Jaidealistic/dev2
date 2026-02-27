/**
 * TEACHER DASHBOARD
 * 
 * Main dashboard for teachers (EDUCATOR role)
 */

'use client';

import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function TeacherDashboard() {
  const teacherName = 'Ms. Johnson';
  const totalStudents = 42;
  const activeClasses = 3;
  const pendingAssignments = 8;

  const recentClasses = [
    { id: 1, name: 'Spanish 101', students: 15, progress: 68, nextSession: 'Today, 2:00 PM' },
    { id: 2, name: 'French Beginners', students: 18, progress: 45, nextSession: 'Tomorrow, 10:00 AM' },
    { id: 3, name: 'Spanish 102', students: 9, progress: 82, nextSession: 'Wednesday, 2:00 PM' },
  ];

  const recentActivity = [
    { id: 1, student: 'Emma Wilson', action: 'Completed "Basic Greetings"', time: '5 min ago' },
    { id: 2, student: 'Lucas Brown', action: 'Submitted quiz - 95%', time: '1 hour ago' },
    { id: 3, student: 'Sophia Chen', action: 'Started "Numbers 1-20"', time: '2 hours ago' },
    { id: 4, student: 'Noah Davis', action: 'Achieved 7-day streak', time: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Lexfix
          </Link>
          <nav className="flex gap-6">
            <Link href="/teacher/dashboard" className="text-[#9db4a0] hover:text-[#8ca394] font-medium">
              Dashboard
            </Link>
            <Link href="/teacher/students" className="text-gray-700 hover:text-gray-900 font-medium">
              My Students
            </Link>
            <Link href="/teacher/classes" className="text-gray-700 hover:text-gray-900 font-medium">
              Classes
            </Link>
            <Link href="/teacher/assignments" className="text-gray-700 hover:text-gray-900 font-medium">
              Assignments
            </Link>
            <Link href="/logout" className="text-gray-700 hover:text-gray-900 font-medium">
              Logout
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {teacherName}! 👋
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Here's what's happening with your classes today
        </p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-[#9db4a0]" aria-hidden="true" />
              <span className="text-3xl font-bold text-gray-900">{totalStudents}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Students</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" aria-hidden="true" />
              <span className="text-3xl font-bold text-gray-900">{activeClasses}</span>
            </div>
            <p className="text-gray-600 font-medium">Active Classes</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" aria-hidden="true" />
              <span className="text-3xl font-bold text-gray-900">{pendingAssignments}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Reviews</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" aria-hidden="true" />
              <span className="text-3xl font-bold text-gray-900">87%</span>
            </div>
            <p className="text-gray-600 font-medium">Avg Progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Classes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Classes</h2>
              <div className="space-y-4">
                {recentClasses.map((classItem) => (
                  <div 
                    key={classItem.id}
                    className="p-4 border border-gray-200 rounded-2xl hover:border-[#9db4a0] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Users className="w-4 h-4" aria-hidden="true" />
                          {classItem.students} students
                          <span className="mx-1">•</span>
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          {classItem.nextSession}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-[#9db4a0] text-white rounded-full text-sm font-medium hover:bg-[#8ca394] transition-colors">
                        View Class
                      </button>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Average Progress</span>
                        <span className="font-medium text-gray-900">{classItem.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#9db4a0]"
                          style={{ width: `${classItem.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-3 border-2 border-[#9db4a0] text-[#9db4a0] rounded-full font-medium hover:bg-[#9db4a0] hover:text-white transition-colors">
                View All Classes
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#9db4a0] flex items-center justify-center text-white font-semibold">
                      {activity.student.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">{activity.student}</span>
                        <span className="text-gray-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394] transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                  Create Assignment
                </button>
                <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-[#9db4a0] hover:text-[#9db4a0] transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  Message Students
                </button>
                <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-[#9db4a0] hover:text-[#9db4a0] transition-colors flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" aria-hidden="true" />
                  View Reports
                </button>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-gradient-to-br from-[#f0f7f0] to-[#e0ede1] rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-gray-900">Spanish 101</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    2:00 PM - 3:30 PM
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-gray-900">Office Hours</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    4:00 PM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
