/**
 * LEARNER LESSON PAGE
 * 
 * Individual lesson view using the MultiModalLesson component
 */

'use client';

import { useRouter, useParams } from 'next/navigation';
import { MultiModalLesson } from '@/components/MultiModalLesson';
import { useToast } from '@/components/providers/ToastProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const { success, error: toastError, info } = useToast();
  const { t } = useLanguage();

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

        // Toast for new achievements
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach((a: any) => {
            success(
              `🏆 ${t('status.achievementEarned')}`,
              a.badgeName
            );
          });
        }

        // Toast for lesson completion result
        const passed = score >= 70;
        const durationMin = Math.floor(duration / 60);
        if (passed) {
          success(
            t('status.lessonCompleted'),
            `${score}% — ${durationMin} min`
          );
        } else {
          info(
            `Score: ${score}%`,
            'Try reviewing the material and retaking the lesson.'
          );
        }

        // Navigate back to dashboard after a short delay so the toast is visible
        setTimeout(() => router.push('/learner/dashboard'), 1500);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toastError(t('status.errorOccurred'), 'Failed to save your progress. Please try again.');
    }
  }

  return (
    <MultiModalLesson
      lessonId={lessonId}
      onComplete={handleLessonComplete}
    />
  );
}
