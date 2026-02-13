/**
 * FLEXIBILITY TOOLS
 * 
 * Features:
 * - Pause / resume learning plan
 * - Light-load weeks
 * - Catch-up mode
 * - Offline lesson packs
 * - Sick-day alternatives
 */

'use client';

import React, { useState } from 'react';
import { 
  Pause, 
  Play, 
  Battery,
  Zap,
  Download,
  Heart,
  AlertCircle,
  Info
} from 'lucide-react';

type LearningStatus = 'active' | 'paused' | 'light-load' | 'catch-up' | 'sick-day';

export default function FlexibilityTools({ params }: { params: { childId: string } }) {
  const { childId } = params;
  const childName = 'Emma';

  const [currentStatus, setCurrentStatus] = useState<LearningStatus>('active');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showLightLoadModal, setShowLightLoadModal] = useState(false);
  const [showCatchUpModal, setShowCatchUpModal] = useState(false);

  const [pauseReason, setPauseReason] = useState('');
  const [pauseDuration, setPauseDuration] = useState('1-week');
  const [lightLoadWeeks, setLightLoadWeeks] = useState(1);

  async function handlePausePlan() {
    // API call would go here
    console.log('Pausing plan:', { reason: pauseReason, duration: pauseDuration });
    setCurrentStatus('paused');
    setShowPauseModal(false);
    alert(`Learning plan paused for ${pauseDuration}`);
  }

  async function handleResumePlan() {
    // API call would go here
    setCurrentStatus('active');
    alert('Learning plan resumed!');
  }

  async function handleLightLoadMode() {
    // API call would go here
    console.log('Activating light-load for:', lightLoadWeeks, 'weeks');
    setCurrentStatus('light-load');
    setShowLightLoadModal(false);
    alert(`Light-load mode activated for ${lightLoadWeeks} weeks`);
  }

  async function handleCatchUpMode() {
    // API call would go here
    setCurrentStatus('catch-up');
    setShowCatchUpModal(false);
    alert('Catch-up mode activated!');
  }

  async function handleDownloadOfflinePack(subject: string) {
    // API call would go here
    console.log('Downloading offline pack for:', subject, 'child:', childId);
    alert(`Downloading offline pack for ${subject}...`);
  }

  async function handleActivateSickDayMode() {
    // API call would go here
    setCurrentStatus('sick-day');
    alert('Sick-day alternatives activated. Rest well!');
  }

  const statusCards = {
    active: {
      color: 'bg-green-50 border-green-200',
      icon: <Play className="w-8 h-8 text-green-600" />,
      title: 'Active Learning',
      description: 'Full schedule with regular lessons',
    },
    paused: {
      color: 'bg-orange-50 border-orange-200',
      icon: <Pause className="w-8 h-8 text-orange-600" />,
      title: 'Paused',
      description: 'Learning temporarily on hold',
    },
    'light-load': {
      color: 'bg-blue-50 border-blue-200',
      icon: <Battery className="w-8 h-8 text-blue-600" />,
      title: 'Light Load',
      description: 'Reduced schedule with essential lessons only',
    },
    'catch-up': {
      color: 'bg-[#f0f7f0] border-[#c5d8c7]',
      icon: <Zap className="w-8 h-8 text-[#5a8c5c]" />,
      title: 'Catch-Up Mode',
      description: 'Focused review of previously covered topics',
    },
    'sick-day': {
      color: 'bg-pink-50 border-pink-200',
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: 'Sick-Day Mode',
      description: 'Gentle alternative activities',
    },
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{childName}'s Learning Flexibility</h1>
          <p className="text-gray-600 mt-1">Adjust learning pace and schedule as needed</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Current Status Card */}
        <div className={`p-8 rounded-3xl border-2 mb-8 ${statusCards[currentStatus].color}`}>
          <div className="flex items-center gap-4 mb-4">
            {statusCards[currentStatus].icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{statusCards[currentStatus].title}</h2>
              <p className="text-gray-700">{statusCards[currentStatus].description}</p>
            </div>
          </div>
          {currentStatus === 'paused' && (
            <button
              onClick={handleResumePlan}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600"
            >
              <Play className="w-5 h-5" />
              Resume Learning
            </button>
          )}
        </div>

        {/* Flexibility Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pause / Resume */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Pause className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pause Learning Plan</h3>
                <p className="text-sm text-gray-600">Take a break without losing progress</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Temporarily pause all lessons for vacations, family events, or personal reasons. Your progress is saved and you can resume anytime.
            </p>
            <button
              onClick={() => setShowPauseModal(true)}
              disabled={currentStatus === 'paused'}
              className="w-full py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStatus === 'paused' ? 'Currently Paused' : 'Pause Plan'}
            </button>
          </div>

          {/* Light-Load Weeks */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Battery className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Light-Load Weeks</h3>
                <p className="text-sm text-gray-600">Reduce learning load temporarily</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Keep learning but at 50% pace. Essential topics only, shorter sessions. Perfect for busy weeks or low-energy periods.
            </p>
            <button
              onClick={() => setShowLightLoadModal(true)}
              disabled={currentStatus === 'light-load'}
              className="w-full py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStatus === 'light-load' ? 'Active Now' : 'Start Light Load'}
            </button>
          </div>

          {/* Catch-Up Mode */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#f0f7f0] rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#5a8c5c]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Catch-Up Mode</h3>
                <p className="text-sm text-gray-600">Review and strengthen weak areas</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Focus on reviewing previously covered topics. System identifies areas needing more practice and creates a custom catch-up plan.
            </p>
            <button
              onClick={() => setShowCatchUpModal(true)}
              disabled={currentStatus === 'catch-up'}
              className="w-full py-3 bg-[#7da47f] text-white rounded-full font-medium hover:bg-[#6b946d] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStatus === 'catch-up' ? 'Active Now' : 'Start Catch-Up'}
            </button>
          </div>

          {/* Sick-Day Alternatives */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sick-Day Alternatives</h3>
                <p className="text-sm text-gray-600">Gentle learning when unwell</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Light activities like audiobooks, educational videos, or simple coloring. No pressure, just stay engaged.
            </p>
            <button
              onClick={handleActivateSickDayMode}
              disabled={currentStatus === 'sick-day'}
              className="w-full py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStatus === 'sick-day' ? 'Active Now' : 'Activate Sick Mode'}
            </button>
          </div>
        </div>

        {/* Offline Lesson Packs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Offline Lesson Packs</h2>
              <p className="text-gray-600">Download lessons for offline learning (travel, low connectivity)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['English', 'Math', 'Tamil'].map((subject) => (
              <div key={subject} className="p-4 border-2 border-gray-200 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{subject} Pack</h3>
                <p className="text-sm text-gray-600 mb-3">Week 7 lessons • 5 activities • 2.3 MB</p>
                <button
                  onClick={() => handleDownloadOfflinePack(subject)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">Offline Mode Tips</p>
              <p className="text-sm text-gray-700">
                Downloaded packs include worksheets, audio files, and instructions. Progress syncs automatically when you reconnect.
              </p>
            </div>
          </div>
        </div>

        {/* Learning History */}
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Adjustments</h2>
          <div className="space-y-3">
            {[
              { date: '2026-01-15', action: 'Paused for winter break', duration: '2 weeks', icon: Pause, color: 'text-orange-600' },
              { date: '2025-12-20', action: 'Activated catch-up mode', duration: '1 week', icon: Zap, color: 'text-[#5a8c5c]' },
              { date: '2025-11-10', action: 'Light-load for exam prep', duration: '2 weeks', icon: Battery, color: 'text-blue-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-600">{item.duration}</p>
                </div>
                <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pause Learning Plan</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason (Optional)</label>
                <select
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none"
                >
                  <option value="">Select reason...</option>
                  <option value="vacation">Family vacation</option>
                  <option value="illness">Illness</option>
                  <option value="event">Family event</option>
                  <option value="burnout">Feeling overwhelmed</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                <select
                  value={pauseDuration}
                  onChange={(e) => setPauseDuration(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none"
                >
                  <option value="1-week">1 week</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl mb-6">
              <p className="text-sm text-gray-700">
                ⚠️ All scheduled lessons will be paused. Progress is saved and automatically resumes on your return date.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePausePlan}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600"
              >
                Pause Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Light Load Modal */}
      {showLightLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Light-Load Mode</h2>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Number of Weeks</label>
              <input
                type="number"
                min="1"
                max="4"
                value={lightLoadWeeks}
                onChange={(e) => setLightLoadWeeks(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none"
              />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-6">
              <p className="text-sm font-bold text-gray-900 mb-2">What changes:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 50% reduced schedule</li>
                <li>• Essential topics only</li>
                <li>• Shorter lesson durations</li>
                <li>• Less homework</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLightLoadModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLightLoadMode}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Catch-Up Modal */}
      {showCatchUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Catch-Up Mode</h2>
            <p className="text-gray-700 mb-4">
              We've identified topics that need more review based on Emma's recent performance:
            </p>
            <div className="space-y-2 mb-6">
              {['English - Reading Comprehension', 'Math - Fraction Operations', 'Tamil - Verb Conjugation'].map((topic, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#f0f7f0] rounded-xl">
                  <AlertCircle className="w-5 h-5 text-[#5a8c5c]" />
                  <span className="text-sm font-medium text-gray-900">{topic}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#f0f7f0] border border-[#c5d8c7] rounded-2xl mb-6">
              <p className="text-sm text-gray-700">
                Catch-up mode creates a focused 1-week plan with extra practice on these topics. Normal lessons resume after.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCatchUpModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCatchUpMode}
                className="flex-1 px-6 py-3 bg-[#7da47f] text-white rounded-full font-medium hover:bg-[#6b946d]"
              >
                Start Catch-Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
