'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionEditor from '@/components/content/SectionEditor';
import TeachingGuideEditor from '@/components/content/TeachingGuideEditor';
import AccessibilityChecker from '@/components/content/AccessibilityChecker';
import NIOSCompetencySelector from '@/components/content/NIOSCompetencySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Eye, Upload } from 'lucide-react';

export default function CreateLessonPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

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
      sections: [] as any[],
    },
    teachingGuide: {
      overview: { en: '', ta: '' },
      learningObjectives: { en: [], ta: [] },
      steps: [] as any[],
    },
    niosCompetencies: [] as string[],
    tags: [] as string[],
    difficulty: 5,
  });

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);

    try {
      const response = await fetch('/api/content/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonData,
          status,
        }),
      });

      if (response.ok) {
        const { lessonId } = await response.json();
        router.push(`/educator/content/${lessonId}/edit`);
      } else {
        alert('Failed to save lesson');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Create New Lesson</h1>
              <p className="text-sm text-muted-foreground">
                Build accessible, multi-modal learning content
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Preview */}}
                aria-label="Preview lesson"
              >
                <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={saving}
                aria-label="Save as draft"
              >
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave('published')}
                disabled={saving}
                aria-label="Publish lesson"
              >
                <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="teaching">Teaching Guide</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title (English) */}
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
                    required
                    aria-required="true"
                  />
                </div>

                {/* Title (Tamil) */}
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
                    className="font-tamil"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Level */}
                  <div className="space-y-2">
                    <Label htmlFor="level">Level*</Label>
                    <Select
                      value={lessonData.level}
                      onValueChange={(value: any) =>
                        setLessonData({ ...lessonData, level: value })
                      }
                    >
                      <SelectTrigger id="level" aria-label="Select difficulty level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Teaching Language*</Label>
                    <Select
                      value={lessonData.language}
                      onValueChange={(value: any) =>
                        setLessonData({ ...lessonData, language: value })
                      }
                    >
                      <SelectTrigger id="language" aria-label="Select teaching language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)*</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="120"
                      value={lessonData.estimatedDuration}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLessonData({
                          ...lessonData,
                          estimatedDuration: parseInt(e.target.value) || 25,
                        })
                      }
                      aria-label="Lesson duration in minutes"
                    />
                    </div>
                </div>

                {/* NIOS Competencies */}
                <div className="space-y-2">
                  <Label htmlFor="nios-competencies">NIOS Competencies</Label>
                  <p className="text-sm text-muted-foreground">
                    Select the NIOS competencies this lesson addresses
                  </p>
                  <NIOSCompetencySelector
                    selected={lessonData.niosCompetencies}
                    onChange={(competencies: any) =>
                      setLessonData({ ...lessonData, niosCompetencies: competencies })
                    }
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas (e.g., greetings, basics, conversation)"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLessonData({
                        ...lessonData,
                        tags: e.target.value.split(',').map((t: string) => t.trim()),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <SectionEditor
              sections={lessonData.content.sections}
              onChange={(sections: any) =>
                setLessonData({
                  ...lessonData,
                  content: { ...lessonData.content, sections },
                })
              }
            />
          </TabsContent>

          {/* Teaching Guide Tab */}
          <TabsContent value="teaching" className="space-y-6">
            <TeachingGuideEditor
              teachingGuide={lessonData.teachingGuide}
              onChange={(teachingGuide: any) =>
                setLessonData({ ...lessonData, teachingGuide })
              }
            />
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilityChecker lessonData={lessonData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}