/**
 * ADHD FOCUS MODE LESSON ROUTE
 * 
 * Distraction-free lesson interface for ADHD learners
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ADHDLesson } from '@/components/ADHDLesson';

export default function ADHDLessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params?.lessonId as string;

    const [lessonSteps, setLessonSteps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLesson();
    }, [lessonId]);

    async function loadLesson() {
        try {
            // TODO: Fetch real lesson from API
            // For now, using mock data
            const mockSteps = [
                {
                    id: '1',
                    type: 'instruction',
                    text: 'Welcome to ADHD Focus Mode! You\'ll see one sentence at a time.'
                },
                {
                    id: '2',
                    type: 'content',
                    text: 'In this lesson, we\'ll learn basic greetings in English.'
                },
                {
                    id: '3',
                    type: 'content',
                    text: 'The word "Hello" is a common greeting used in English-speaking countries.'
                },
                {
                    id: '4',
                    type: 'question',
                    text: 'Which word is a common English greeting?',
                    options: ['Goodbye', 'Hello', 'Sleep', 'Run'],
                    correctAnswer: 1
                },
                {
                    id: '5',
                    type: 'content',
                    text: 'Great work! "Good morning" is used when you meet someone before noon.'
                },
                {
                    id: '6',
                    type: 'question',
                    text: 'When would you say "Good morning"?',
                    options: ['At night', 'In the afternoon', 'Before noon', 'Anytime'],
                    correctAnswer: 2
                },
                {
                    id: '7',
                    type: 'content',
                    text: 'You can use "How are you?" to ask someone about their well-being.'
                },
                {
                    id: '8',
                    type: 'question',
                    text: 'What does "How are you?" mean?',
                    options: [
                        'Asking for directions',
                        'Asking about someone\'s name',
                        'Asking about someone\'s well-being',
                        'Saying goodbye'
                    ],
                    correctAnswer: 2
                }
            ];

            setLessonSteps(mockSteps);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading lesson:', error);
            setIsLoading(false);
        }
    }

    async function handleComplete(score: number) {
        try {
            // Save completion
            const response = await fetch(`/api/learner/lessons/${lessonId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    score,
                    duration: 300, // Calculate actual time
                    errorPatterns: []
                })
            });

            if (response.ok) {
                const data = await response.json();

                // Show completion message
                alert(`✅ Lesson Complete!\n\nYour Score: ${score}%\n${data.message || ''}`);

                // Navigate back to lessons
                router.push('/learner/lessons');
            }
        } catch (error) {
            console.error('Error completing lesson:', error);
            alert('Failed to save progress. Please try again.');
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
                <div className="text-center">
                    <div className="w-12 h-12 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#6b6b6b]">Loading your lesson...</p>
                </div>
            </div>
        );
    }

    return (
        <ADHDLesson
            lessonId={lessonId}
            steps={lessonSteps}
            onComplete={handleComplete}
        />
    );
}
