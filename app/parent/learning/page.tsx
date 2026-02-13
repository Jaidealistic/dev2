/**
 * PARENT LEARNING & SUPPORT HUB
 * 
 * Features:
 * - Micro-courses access (teaching strategies, disability support)
 * - Course progress tracking
 * - Certificates download
 * - Live office hours access
 * - Parent community forum
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Video,
  Award,
  Download,
  Clock,
  Users,
  MessageCircle,
  Calendar,
  Play,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Heart
} from 'lucide-react';

type Course = {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  modules: number;
  progress: number; // percentage
  status: 'not-started' | 'in-progress' | 'completed';
  category: 'teaching' | 'disability' | 'assessment' | 'well-being';
  certificateAvailable: boolean;
};

type OfficeHour = {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  topic: string;
  spotsLeft: number;
  registered: boolean;
};

type ForumPost = {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  category: string;
  excerpt: string;
  replies: number;
  likes: number;
  timeAgo: string;
};

export default function ParentLearningHub() {
  const [activeTab, setActiveTab] = useState<'courses' | 'office-hours' | 'community'>('courses');
  const [courseFilter, setCourseFilter] = useState<'all' | 'teaching' | 'disability' | 'assessment' | 'well-being'>('all');

  // Mock data
  const courses: Course[] = [
    {
      id: 'c1',
      title: 'Teaching Strategies for Dyslexia',
      description: 'Learn effective multi-sensory techniques for teaching reading to children with dyslexia',
      duration: 45,
      modules: 6,
      progress: 80,
      status: 'in-progress',
      category: 'disability',
      certificateAvailable: true,
    },
    {
      id: 'c2',
      title: 'Managing ADHD in Homeschool',
      description: 'Practical strategies for maintaining focus and structuring learning time',
      duration: 60,
      modules: 8,
      progress: 100,
      status: 'completed',
      category: 'disability',
      certificateAvailable: true,
    },
    {
      id: 'c3',
      title: 'Effective Language Teaching Methods',
      description: 'Best practices for teaching English and Tamil to elementary students',
      duration: 90,
      modules: 10,
      progress: 0,
      status: 'not-started',
      category: 'teaching',
      certificateAvailable: true,
    },
    {
      id: 'c4',
      title: 'Assessment & Progress Tracking',
      description: 'Learn how to evaluate learning outcomes and document progress',
      duration: 50,
      modules: 7,
      progress: 30,
      status: 'in-progress',
      category: 'assessment',
      certificateAvailable: true,
    },
    {
      id: 'c5',
      title: 'Preventing Parent Burnout',
      description: 'Self-care strategies for homeschooling parents',
      duration: 40,
      modules: 5,
      progress: 0,
      status: 'not-started',
      category: 'well-being',
      certificateAvailable: false,
    },
  ];

  const officeHours: OfficeHour[] = [
    {
      id: 'oh1',
      title: 'Q&A: Teaching Multiple Grade Levels',
      date: '2026-02-10',
      time: '7:00 PM IST',
      host: 'Dr. Priya Sharma',
      topic: 'Strategies for managing parallel schedules',
      spotsLeft: 15,
      registered: false,
    },
    {
      id: 'oh2',
      title: 'Supporting Auditory Processing Issues',
      date: '2026-02-12',
      time: '6:30 PM IST',
      host: 'Speech Therapist Raj Kumar',
      topic: 'APD-friendly teaching techniques',
      spotsLeft: 8,
      registered: true,
    },
    {
      id: 'oh3',
      title: 'Tamil Language Mastery Tips',
      date: '2026-02-15',
      time: '8:00 PM IST',
      host: 'Tamil Teacher Lakshmi',
      topic: 'Building vocabulary and confidence',
      spotsLeft: 20,
      registered: false,
    },
  ];

  const forumPosts: ForumPost[] = [
    {
      id: 'fp1',
      author: 'Anjali M.',
      authorAvatar: 'A',
      title: 'How do you handle resistance to math lessons?',
      category: 'Teaching Strategies',
      excerpt: "My 8yo refuses to do math. We've tried games, manipulatives, and breaks but...",
      replies: 23,
      likes: 45,
      timeAgo: '2 hours ago',
    },
    {
      id: 'fp2',
      author: 'Vikram S.',
      authorAvatar: 'V',
      title: 'Best resources for Tamil reading practice?',
      category: 'Resources',
      excerpt: 'Looking for age-appropriate Tamil storybooks and apps for Grade 4...',
      replies: 17,
      likes: 32,
      timeAgo: '5 hours ago',
    },
    {
      id: 'fp3',
      author: 'Meera K.',
      authorAvatar: 'M',
      title: 'Successfully transitioned to homeschool - our story',
      category: 'Success Stories',
      excerpt: "After 2 months, my son with dyslexia is thriving! Here's what worked...",
      replies: 56,
      likes: 120,
      timeAgo: '1 day ago',
    },
  ];

  const filteredCourses = courseFilter === 'all' 
    ? courses 
    : courses.filter(c => c.category === courseFilter);

  const categoryColors = {
    teaching: 'bg-blue-100 text-blue-700',
    disability: 'bg-[#f0f7f0] text-[#5a8c5c]',
    assessment: 'bg-green-100 text-green-700',
    'well-being': 'bg-pink-100 text-pink-700',
  };

  const categoryIcons = {
    teaching: <BookOpen className="w-5 h-5" />,
    disability: <Heart className="w-5 h-5" />,
    assessment: <TrendingUp className="w-5 h-5" />,
    'well-being': <Lightbulb className="w-5 h-5" />,
  };

  async function handleRegisterOfficeHour(sessionId: string) {
    // API call would go here
    console.log('Registering for office hour:', sessionId);
    alert("Registered! You'll receive a calendar invite.");
  }

  async function handleDownloadCertificate(courseId: string) {
    // API call would go here
    console.log('Downloading certificate for course:', courseId);
    alert('Downloading certificate...');
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Learning Hub</h1>
              <p className="text-gray-600 mt-1">Professional development for homeschool educators</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'completed').length}/{courses.length}
                </p>
                <p className="text-sm text-gray-600">Courses Completed</p>
              </div>
              <Award className="w-10 h-10 text-[#9db4a0]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'courses', label: 'Micro-Courses', icon: GraduationCap },
              { id: 'office-hours', label: 'Live Office Hours', icon: Video },
              { id: 'community', label: 'Community Forum', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#9db4a0] text-[#9db4a0]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            {/* Category Filter */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-4 py-2 rounded-full font-medium ${
                  courseFilter === 'all'
                    ? 'bg-[#9db4a0] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Courses
              </button>
              {['teaching', 'disability', 'assessment', 'well-being'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCourseFilter(cat as any)}
                  className={`px-4 py-2 rounded-full font-medium capitalize ${
                    courseFilter === cat
                      ? 'bg-[#9db4a0] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[course.category]}`}>
                      {categoryIcons[course.category]}
                      {course.category.replace('-', ' ')}
                    </span>
                    {course.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.modules} modules
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {course.status !== 'not-started' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#9db4a0] h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/parent/learning/courses/${course.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
                    >
                      {course.status === 'not-started' ? (
                        <>
                          <Play className="w-5 h-5" />
                          Start Course
                        </>
                      ) : course.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Continue
                        </>
                      )}
                    </Link>
                    {course.status === 'completed' && course.certificateAvailable && (
                      <button
                        onClick={() => handleDownloadCertificate(course.id)}
                        className="px-4 py-3 border-2 border-[#9db4a0] text-[#9db4a0] rounded-full font-medium hover:bg-[#9db4a0] hover:text-white"
                        title="Download Certificate"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Certificates Section */}
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200">
              <div className="flex items-center gap-4 mb-6">
                <Award className="w-12 h-12 text-yellow-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Certificates</h2>
                  <p className="text-gray-600">Download and share your achievements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.filter(c => c.status === 'completed' && c.certificateAvailable).map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl p-4 border border-yellow-300">
                    <Award className="w-8 h-8 text-yellow-600 mb-2" />
                    <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Completed February 2026</p>
                    <button
                      onClick={() => handleDownloadCertificate(course.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OFFICE HOURS TAB */}
        {activeTab === 'office-hours' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Live Sessions</h2>
              <p className="text-gray-600">Join expert-led Q&A sessions and workshops</p>
            </div>

            <div className="space-y-4">
              {officeHours.map((session) => (
                <div key={session.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-[#5a8c5c]" />
                        <span className="font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="px-3 py-1 bg-[#f0f7f0] text-[#5a8c5c] rounded-full text-sm font-medium">
                          {session.time}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h3>
                      <p className="text-gray-700 mb-3">{session.topic}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Host: {session.host}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.spotsLeft} spots left
                        </span>
                      </div>
                    </div>
                    <div>
                      {session.registered ? (
                        <div className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Registered
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegisterOfficeHour(session.id)}
                          className="px-6 py-3 bg-[#7da47f] text-white rounded-full font-medium hover:bg-[#6b946d]"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Past Sessions */}
            <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Past Session Recordings</h2>
              <div className="space-y-3">
                {['Teaching with Visual Schedules', 'Multi-Sensory Math Strategies', 'Building Reading Confidence'].map((title, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Video className="w-6 h-6 text-gray-400" />
                    <span className="flex-1 font-medium text-gray-900">{title}</span>
                    <button className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-[#9db4a0] hover:text-[#9db4a0]">
                      Watch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent Community Forum</h2>
                <p className="text-gray-600">Connect, share, and learn from other homeschooling parents</p>
              </div>
              <Link
                href="/parent/community/new-post"
                className="flex items-center gap-2 px-6 py-3 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
              >
                <MessageCircle className="w-5 h-5" />
                New Post
              </Link>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['All', 'Teaching Strategies', 'Resources', 'Success Stories', 'Q&A', 'Support'].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Forum Posts */}
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#9db4a0] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {post.authorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{post.author}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.timeAgo}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <button className="flex items-center gap-1 hover:text-[#9db4a0]">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies} replies
                        </button>
                        <button className="flex items-center gap-1 hover:text-[#9db4a0]">
                          <Heart className="w-4 h-4" />
                          {post.likes} likes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Guidelines */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Community Guidelines
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Be respectful and supportive of all parents</li>
                <li>✓ Share experiences, not medical advice</li>
                <li>✓ Respect privacy - no identifying information</li>
                <li>✓ Report inappropriate content to moderators</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
