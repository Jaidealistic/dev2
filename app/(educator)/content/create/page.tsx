'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Eye } from 'lucide-react';

export default function CreateLessonPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [lessonData, setLessonData] = useState({
    title: { en: '', ta: '' },
    level: 'beginner',
    language: 'en',
    estimatedDuration: 25,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: { en: '', ta: '' },
        audioUrl: { en: '', ta: '' },
        imageUrl: '',
      },
      sections: [],
    },
    teachingGuide: {
      overview: { en: '', ta: '' },
      learningObjectives: { en: [], ta: [] },
      steps: [],
    },
    niosCompetencies: [],
    tags: [],
    difficulty: 5,
  });

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lessonData, status }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/educator/content/${data.lessonId}/edit`);
      } else {
        alert('Failed to save lesson');
      }
    } catch (error) {
      alert('Error saving lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Build accessible, multi-modal content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="teaching">Teaching Guide</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title-en">Title (English)*</Label>
                  <Input
                    id="title-en"
                    value={lessonData.title.en}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        title: { ...lessonData.title, en: e.target.value },
                      })
                    }
                    placeholder="e.g., Greetings and Introductions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title-ta">Title (Tamil)*</Label>
                  <Input
                    id="title-ta"
                    value={lessonData.title.ta}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        title: { ...lessonData.title, ta: e.target.value },
                      })
                    }
                    placeholder="வணக்கங்களும் அறிமுகங்களும்"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level*</Label>
                  <Select
                    value={lessonData.level}
                    onValueChange={(value) =>
                      setLessonData({ ...lessonData, level: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language*</Label>
                  <Select
                    value={lessonData.language}
                    onValueChange={(value) =>
                      setLessonData({ ...lessonData, language: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)*</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={lessonData.estimatedDuration}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        estimatedDuration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intro-en">Introduction (English)</Label>
                <Textarea
                  id="intro-en"
                  value={lessonData.content.introduction.text.en}
                  onChange={(e) =>
                    setLessonData({
                      ...lessonData,
                      content: {
                        ...lessonData.content,
                        introduction: {
                          ...lessonData.content.introduction,
                          text: {
                            ...lessonData.content.introduction.text,
                            en: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="Today we'll learn..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intro-ta">Introduction (Tamil)</Label>
                <Textarea
                  id="intro-ta"
                  value={lessonData.content.introduction.text.ta}
                  onChange={(e) =>
                    setLessonData({
                      ...lessonData,
                      content: {
                        ...lessonData.content,
                        introduction: {
                          ...lessonData.content.introduction,
                          text: {
                            ...lessonData.content.introduction.text,
                            ta: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="இன்று நாம் கற்போம்..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Add vocabulary, practice exercises, and quizzes
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teaching">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Overview (English)</Label>
                  <Textarea
                    value={lessonData.teachingGuide.overview.en}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        teachingGuide: {
                          ...lessonData.teachingGuide,
                          overview: {
                            ...lessonData.teachingGuide.overview,
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="This lesson introduces..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Overview (Tamil)</Label>
                  <Textarea
                    value={lessonData.teachingGuide.overview.ta}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        teachingGuide: {
                          ...lessonData.teachingGuide,
                          overview: {
                            ...lessonData.teachingGuide.overview,
                            ta: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="இந்த பாடம்..."
                    rows={3}
                  />
                </div>

                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add Teaching Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {lessonData.title.en || 'Untitled Lesson'}
                  </h3>
                  <p className="text-gray-600">{lessonData.title.ta}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {lessonData.level}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {lessonData.estimatedDuration} min
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Introduction:</h4>
                  <p className="text-gray-700">
                    {lessonData.content.introduction.text.en || 'No introduction added'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
