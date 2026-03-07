'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, ChevronLeft, Upload, FileJson } from 'lucide-react';
import Link from 'next/link';
import { getToken } from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';

export default function LessonUploadPage() {
    const router = useRouter();
    const [jsonInput, setJsonInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string | null>(null);

    const handleValidate = () => {
        setError(null);
        setValidationErrors([]);
        setSuccess(null);

        try {
            if (!jsonInput.trim()) {
                setError('Please enter some JSON data.');
                return false;
            }
            JSON.parse(jsonInput);
            setSuccess('JSON is syntactically valid.');
            return true;
        } catch (e: any) {
            setError(`Invalid JSON syntax: ${e.message}`);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handleValidate()) return;

        setIsSubmitting(true);
        setError(null);
        setValidationErrors([]);
        setSuccess(null);

        try {
            const token = getToken();
            if (!token) {
                setError('You must be logged in to upload lessons.');
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/api/admin/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: jsonInput,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details && Array.isArray(data.details)) {
                    setValidationErrors(data.details);
                    setError('Validation failed. Please check the requirements below.');
                } else {
                    setError(data.error || 'Failed to upload lesson.');
                }
            } else {
                setSuccess('Lesson uploaded successfully!');
                setJsonInput('');
                // Optional: redirect after success
                // setTimeout(() => router.push('/admin/content'), 2000);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const insertExample = () => {
        const example = {
            lessonId: "L-" + Math.floor(Math.random() * 10000),
            title: { en: "Introduction to Greetings", ta: "வாழ்த்துக்கள் அறிமுகம்" },
            level: "beginner",
            language: "en",
            estimatedDuration: 15,
            content: {
                introduction: {
                    text: { en: "Welcome to your first lesson!", ta: "உங்கள் முதல் பாடத்திற்கு வரவேற்கிறோம்!" }
                },
                sections: [
                    {
                        type: "vocabulary",
                        sectionId: "v1",
                        title: { en: "Basic Words", ta: "அடிப்படை சொற்கள்" },
                        items: ["Hello", "Good morning", "Thank you"]
                    }
                ]
            },
            teachingGuide: {
                overview: { en: "Teaches basics", ta: "அடிப்படைகளைக் கற்றுக்கொடுக்கிறது" },
                learningObjectives: { en: ["Greet people"], ta: ["வாழ்த்துதல்"] },
                steps: [
                    {
                        stepNumber: 1,
                        title: "Introduction",
                        durationMinutes: 5,
                        script: "Say hello",
                        materialsNeeded: [],
                        adaptations: {}
                    }
                ]
            },
            status: "published",
            visibility: "public"
        };
        setJsonInput(JSON.stringify(example, null, 2));
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader
                title="Lesson Upload Tool"
                description="JSON-based content management for lessons"
                showUpload={false}
            />

            <div className="p-8 max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-end">
                    <Button variant="outline" onClick={insertExample} className="flex gap-2">
                        <FileJson className="h-4 w-4" />
                        Insert Example Template
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson Data (JSON)</CardTitle>
                                <CardDescription>
                                    Paste the lesson JSON content below. The system will validate it against the required schema.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        placeholder='{ "lessonId": "L-101", ... }'
                                        className="min-h-[500px] font-mono text-sm bg-slate-50 border-slate-200 focus:bg-white"
                                        spellCheck={false}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleValidate}
                                            disabled={isSubmitting}
                                        >
                                            Validate Syntax
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#7a9b7e] hover:bg-[#6b8c6f] text-white px-8"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Uploading...' : 'Upload Lesson'}
                                            {!isSubmitting && <Upload className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Validation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-700 text-sm">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">{error}</p>
                                            {validationErrors.length > 0 && (
                                                <ul className="mt-2 list-disc list-inside space-y-1">
                                                    {validationErrors.map((err, i) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex gap-3 text-green-700 text-sm font-medium">
                                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                        <p>{success}</p>
                                    </div>
                                )}

                                {!error && !success && !isSubmitting && (
                                    <div className="text-center py-8 text-slate-400">
                                        <FileJson className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm italic">Ready for validation</p>
                                    </div>
                                )}

                                {isSubmitting && (
                                    <div className="text-center py-8 text-slate-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a9b7e] mx-auto mb-2"></div>
                                        <p className="text-sm">Processing lesson data...</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2 text-slate-600">
                                <p>• <strong>lessonId</strong> must be unique.</p>
                                <p>• <strong>title</strong> requires both <code>en</code> and <code>ta</code>.</p>
                                <p>• <strong>level</strong>: beginner, intermediate, advanced.</p>
                                <p>• <strong>status</strong>: draft, published, archived.</p>
                                <p>• <strong>visibility</strong>: private, school, public.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
