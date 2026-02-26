/**
 * FAMILY DASHBOARD - Multi-Child Management
 * 
 * Features:
 * - Overview of all children at once
 * - Parallel schedules view
 * - Staggered independent work suggestions
 * - Bulk actions (pause, vacation, attendance)
 * - Shared resource library
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  BookOpen,
  Pause,
  Plane,
  CheckSquare,
  Library
} from 'lucide-react';

type Child = {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  status: 'active' | 'paused' | 'vacation';
  todaySchedule: {
    time: string;
    subject: string;
    duration: number;
    type: 'independent' | 'guided' | 'review';
    completed: boolean;
  }[];
  weeklyHours: number;
  recommendedHours: number;
};

export default function FamilyDashboard() {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Mock family data
  const children: Child[] = [
    {
      id: '1',
      name: 'Emma',
      avatar: 'E',
      grade: 'Grade 5',
      status: 'active',
      todaySchedule: [
        { time: '9:00 AM', subject: 'English - Reading Comprehension', duration: 30, type: 'independent', completed: true },
        { time: '9:30 AM', subject: 'Math - Fractions', duration: 45, type: 'guided', completed: true },
        { time: '10:15 AM', subject: 'Tamil - Vocabulary', duration: 20, type: 'independent', completed: false },
        { time: '2:00 PM', subject: 'English - Writing Practice', duration: 30, type: 'review', completed: false },
      ],
      weeklyHours: 8.5,
      recommendedHours: 10,
    },
    {
      id: '2',
      name: 'Lucas',
      avatar: 'L',
      grade: 'Grade 3',
      status: 'active',
      todaySchedule: [
        { time: '9:00 AM', subject: 'English - Phonics', duration: 25, type: 'guided', completed: true },
        { time: '10:30 AM', subject: 'Math - Addition', duration: 30, type: 'independent', completed: false },
        { time: '2:30 PM', subject: 'Tamil - Story Time', duration: 20, type: 'guided', completed: false },
      ],
      weeklyHours: 6.0,
      recommendedHours: 8,
    },
    {
      id: '3',
      name: 'Ava',
      avatar: 'A',
      grade: 'Grade 7',
      status: 'active',
      todaySchedule: [
        { time: '8:30 AM', subject: 'English - Essay Writing', duration: 45, type: 'independent', completed: true },
        { time: '9:30 AM', subject: 'Math - Algebra', duration: 50, type: 'guided', completed: false },
        { time: '11:00 AM', subject: 'Tamil - Grammar', duration: 30, type: 'review', completed: false },
      ],
      weeklyHours: 12.0,
      recommendedHours: 12,
    },
  ];

  function toggleChildSelection(childId: string) {
    setSelectedChildren(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  }

  function selectAllChildren() {
    setSelectedChildren(children.map(c => c.id));
  }

  function deselectAll() {
    setSelectedChildren([]);
  }

  async function handleBulkAction(action: 'pause' | 'vacation' | 'attendance') {
    if (selectedChildren.length === 0) return;
    
    // API call would go here
    console.log(`Bulk ${action} for:`, selectedChildren);
    alert(`${action} applied to ${selectedChildren.length} children`);
    deselectAll();
  }

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-orange-100 text-orange-700',
    vacation: 'bg-blue-100 text-blue-700',
  };

  const typeColors = {
    independent: 'bg-blue-50 border-blue-200',
    guided: 'bg-[#f0f7f0] border-[#c5d8c7]',
    review: 'bg-green-50 border-green-200',
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all your children's learning in one place</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
              </div>
              <Link
                href="/parent/resources"
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-[#9db4a0] hover:text-[#9db4a0]"
              >
                <Library className="w-5 h-5" aria-hidden="true" />
                Resource Library
              </Link>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedChildren.length > 0 && (
            <div className="mt-4 bg-[#9db4a0] bg-opacity-10 border-2 border-[#9db4a0] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#9db4a0]" aria-hidden="true" />
                <span className="font-medium text-gray-900">
                  {selectedChildren.length} children selected
                </span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600"
                >
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  Pause All
                </button>
                <button
                  onClick={() => handleBulkAction('vacation')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
                >
                  <Plane className="w-4 h-4" aria-hidden="true" />
                  Vacation Mode
                </button>
                <button
                  onClick={() => handleBulkAction('attendance')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600"
                >
                  <CheckSquare className="w-4 h-4" aria-hidden="true" />
                  Mark Attendance
                </button>
              </div>
            </div>
          )}

          {/* Quick Select */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Quick select:</span>
            <button
              onClick={selectAllChildren}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              All Children
            </button>
            <button
              onClick={() => setSelectedChildren(children.filter(c => c.status === 'active').map(c => c.id))}
              className="text-sm px-3 py-1 bg-green-100 hover:bg-green-200 rounded-full text-green-700"
            >
              Active Only
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] rounded-3xl p-6 border-2 border-[#c5d8c7]">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#5a8c5c]" aria-hidden="true" />
                Today's Parallel Schedule
              </h2>
              <p className="text-gray-600 mb-6">Tuesday, February 8, 2026</p>

              {/* Time Grid */}
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="bg-white rounded-2xl p-5 border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedChildren.includes(child.id)}
                        onChange={() => toggleChildSelection(child.id)}
                        className="w-5 h-5 text-[#9db4a0] rounded focus:ring-[#9db4a0]"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#9db4a0] flex items-center justify-center text-white text-xl font-bold">
                        {child.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-600">{child.grade}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[child.status]}`}>
                        {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Weekly Hours</p>
                        <p className="text-lg font-bold text-gray-900">{child.weeklyHours} / {child.recommendedHours}h</p>
                      </div>
                    </div>

                    {/* Schedule Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {child.todaySchedule.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border-2 ${typeColors[item.type]} ${
                            item.completed ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-600">{item.time}</span>
                            {item.completed && (
                              <span className="text-xs text-green-600">✓ Done</span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-gray-900 mb-1">{item.subject}</p>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              {item.duration}m
                            </span>
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staggered Independent Work Suggestions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" aria-hidden="true" />
                Staggered Independent Work
              </h2>
              <p className="text-gray-600 mb-6">Suggested schedule to minimize overlapping guided sessions</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="font-bold text-gray-900 mb-2">Emma (9:00 - 9:30 AM)</p>
                  <p className="text-sm text-gray-600">Independent reading while you teach Lucas phonics</p>
                </div>
                <div className="p-4 bg-[#f0f7f0] rounded-xl border border-[#c5d8c7]">
                  <p className="font-bold text-gray-900 mb-2">Lucas (2:00 - 2:30 PM)</p>
                  <p className="text-sm text-gray-600">Math worksheet while you guide Ava with essay</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="font-bold text-gray-900 mb-2">Ava (10:15 - 10:45 AM)</p>
                  <p className="text-sm text-gray-600">Review exercises while you teach Emma fractions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <input
                    type="checkbox"
                    checked={selectedChildren.includes(child.id)}
                    onChange={() => toggleChildSelection(child.id)}
                    className="mt-1 w-5 h-5 text-[#9db4a0] rounded focus:ring-[#9db4a0]"
                  />
                  <div className="w-16 h-16 rounded-full bg-[#9db4a0] flex items-center justify-center text-white text-2xl font-bold">
                    {child.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[child.status]}`}>
                      {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Weekly Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#9db4a0] h-2 rounded-full"
                        style={{ width: `${(child.weeklyHours / child.recommendedHours) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {child.weeklyHours}/{child.recommendedHours}h
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-gray-700">Today's Schedule:</p>
                  {child.todaySchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${typeColors[item.type]} ${
                        item.completed ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">{item.time}</span>
                        {item.completed && <span className="text-xs text-green-600">✓</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{item.subject}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/parent/children/${child.id}`}
                  className="block w-full py-2 text-center bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
