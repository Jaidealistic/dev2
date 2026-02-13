/**
 * LEARNER LESSON PAGE
 * 
 * Individual lesson view using the MultiModalLesson component
 */

'use client';

import { useRouter, useParams } from 'next/navigation';
import { MultiModalLesson } from '@/components/MultiModalLesson';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.lessonId as string;

  async function handleLessonComplete(score: number, duration: number) {
    try {
      // Submit completion to backend
      const response = await fetch(`/api/learner/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          score,
          duration,
          errorPatterns: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show achievement modal if new achievements earned
        if (data.newAchievements && data.newAchievements.length > 0) {
          alert(`🎉 New achievements earned: ${data.newAchievements.map((a: any) => a.badgeName).join(', ')}`);
        }

        // Show completion modal
        const passed = score >= 70;
        const message = passed
          ? `Great job! You scored ${score}% and completed the lesson in ${Math.floor(duration / 60)} minutes.`
          : `You scored ${score}%. Try reviewing the material and retaking the lesson.`;
        
        alert(message);

        // Navigate back to dashboard
        router.push('/learner/dashboard');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Failed to save your progress. Please try again.');
    }
  }

  return (
    <MultiModalLesson
      lessonId={lessonId}
      onComplete={handleLessonComplete}
    />
  );
}
