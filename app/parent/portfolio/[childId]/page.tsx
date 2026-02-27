/**
 * PORTFOLIO & COMPLIANCE SYSTEM
 * 
 * Features:
 * - Auto lesson logs
 * - Upload work samples (photo/video/pdf)
 * - Parent reflections
 * - Competency mapping (NIOS)
 * - Export: progress report, learning hours log, annual review PDF
 */

'use client';

import React, { useState, use } from 'react';
import {
  Upload,
  FileText,
  Image,
  Video,
  File,
  Download,
  Calendar,
  Clock,
  Award,
  BookOpen,
  MessageSquare,
  Filter,
  Search,
  Plus,
  X
} from 'lucide-react';

type WorkSample = {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'pdf' | 'document';
  uploadDate: string;
  lessonId?: string;
  subject: string;
  thumbnail?: string;
  competencies: string[];
};

type LessonLog = {
  id: string;
  date: string;
  subject: string;
  topic: string;
  duration: number;
  competenciesCovered: string[];
  parentReflection?: string;
  workSampleIds: string[];
};

type NIOSCompetency = {
  code: string;
  description: string;
  progress: number; // percentage
  evidenceCount: number;
};

export default function PortfolioPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const [activeTab, setActiveTab] = useState<'logs' | 'samples' | 'competencies' | 'reflections'>('logs');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LessonLog | null>(null);

  // Mock data
  const childName = 'Emma';
  const totalLearningHours = 145.5;
  const currentMonth = 'February 2026';

  const lessonLogs: LessonLog[] = [
    {
      id: 'log-1',
      date: '2026-02-08',
      subject: 'English',
      topic: 'Reading Comprehension - Story Analysis',
      duration: 45,
      competenciesCovered: ['ENG-5-R1', 'ENG-5-R3'],
      parentReflection: 'Emma showed excellent understanding of character motivations. She made insightful connections to her own experiences.',
      workSampleIds: ['ws-1', 'ws-2'],
    },
    {
      id: 'log-2',
      date: '2026-02-08',
      subject: 'Math',
      topic: 'Fractions - Addition and Subtraction',
      duration: 50,
      competenciesCovered: ['MAT-5-N4', 'MAT-5-N5'],
      workSampleIds: ['ws-3'],
    },
    {
      id: 'log-3',
      date: '2026-02-07',
      subject: 'Tamil',
      topic: 'Vocabulary Building - Daily Life Words',
      duration: 30,
      competenciesCovered: ['TAM-5-V2'],
      parentReflection: 'Great progress with pronunciation. Needs more practice with writing.',
      workSampleIds: [],
    },
  ];

  const workSamples: WorkSample[] = [
    {
      id: 'ws-1',
      title: 'Character Analysis Worksheet',
      type: 'photo',
      uploadDate: '2026-02-08',
      lessonId: 'log-1',
      subject: 'English',
      thumbnail: '/samples/worksheet1.jpg',
      competencies: ['ENG-5-R1'],
    },
    {
      id: 'ws-2',
      title: 'Story Map Drawing',
      type: 'photo',
      uploadDate: '2026-02-08',
      lessonId: 'log-1',
      subject: 'English',
      thumbnail: '/samples/drawing1.jpg',
      competencies: ['ENG-5-R3'],
    },
    {
      id: 'ws-3',
      title: 'Fraction Practice Video',
      type: 'video',
      uploadDate: '2026-02-08',
      lessonId: 'log-2',
      subject: 'Math',
      thumbnail: '/samples/video1.jpg',
      competencies: ['MAT-5-N4', 'MAT-5-N5'],
    },
  ];

  const niosCompetencies: NIOSCompetency[] = [
    { code: 'ENG-5-R1', description: 'Read and comprehend grade-level texts', progress: 75, evidenceCount: 8 },
    { code: 'ENG-5-R3', description: 'Analyze character motivations and themes', progress: 60, evidenceCount: 5 },
    { code: 'MAT-5-N4', description: 'Add and subtract fractions with unlike denominators', progress: 80, evidenceCount: 12 },
    { code: 'MAT-5-N5', description: 'Solve real-world problems involving fractions', progress: 65, evidenceCount: 7 },
    { code: 'TAM-5-V2', description: 'Use grade-appropriate vocabulary in context', progress: 70, evidenceCount: 9 },
  ];

  async function handleFileUpload(files: FileList, lessonId?: string) {
    // API call would go here
    console.log('Uploading files:', files.length, 'for lesson:', lessonId);
    alert(`${files.length} file(s) uploaded successfully`);
    setUploadModalOpen(false);
  }

  async function handleAddReflection(logId: string, reflection: string) {
    // API call would go here
    console.log('Adding reflection to log:', logId, reflection);
    alert('Reflection saved successfully');
    setReflectionModalOpen(false);
    setSelectedLog(null);
  }

  async function handleExport(exportType: 'progress' | 'hours' | 'annual') {
    // API call would go here
    console.log('Exporting:', exportType, 'for child:', childId);
    alert(`Generating ${exportType} report...`);
  }

  const fileTypeIcons = {
    photo: <Image className="w-6 h-6" />,
    video: <Video className="w-6 h-6" aria-hidden="true" />,
    pdf: <File className="w-6 h-6" aria-hidden="true" />,
    document: <FileText className="w-6 h-6" aria-hidden="true" />,
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{childName}'s Portfolio</h1>
              <p className="text-gray-600 mt-1">Learning documentation & compliance tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                Upload Work Sample
              </button>
              <div className="relative">
                <button
                  onClick={() => handleExport('progress')}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-[#9db4a0] hover:text-[#9db4a0]"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Export Reports
                </button>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Clock className="w-6 h-6 text-blue-600 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-gray-900">{totalLearningHours}h</p>
              <p className="text-sm text-gray-600">Total Learning Hours</p>
            </div>
            <div className="p-4 bg-[#f0f7f0] rounded-2xl">
              <BookOpen className="w-6 h-6 text-[#5a8c5c] mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-gray-900">{lessonLogs.length}</p>
              <p className="text-sm text-gray-600">Lesson Logs</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl">
              <Image className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workSamples.length}</p>
              <p className="text-sm text-gray-600">Work Samples</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl">
              <Award className="w-6 h-6 text-orange-600 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-gray-900">{niosCompetencies.length}</p>
              <p className="text-sm text-gray-600">Competencies Tracked</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b border-gray-200">
            {[
              { id: 'logs', label: 'Lesson Logs', icon: BookOpen },
              { id: 'samples', label: 'Work Samples', icon: Image },
              { id: 'competencies', label: 'NIOS Competencies', icon: Award },
              { id: 'reflections', label: 'Parent Reflections', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === tab.id
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
        {/* LESSON LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{currentMonth} Lesson Logs</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-gray-400">
                  <Filter className="w-4 h-4" aria-hidden="true" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-gray-400">
                  <Search className="w-4 h-4" aria-hidden="true" />
                  Search
                </button>
              </div>
            </div>

            {lessonLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      <span className="text-sm text-gray-600">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {log.subject}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{log.topic}</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {log.duration} minutes
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLog(log);
                      setReflectionModalOpen(true);
                    }}
                    className="px-4 py-2 border-2 border-[#9db4a0] text-[#9db4a0] rounded-full font-medium hover:bg-[#9db4a0] hover:text-white"
                  >
                    {log.parentReflection ? 'Edit Reflection' : 'Add Reflection'}
                  </button>
                </div>

                {/* Competencies */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">Competencies Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {log.competenciesCovered.map((comp) => (
                      <span key={comp} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Parent Reflection */}
                {log.parentReflection && (
                  <div className="p-4 bg-[#f0f7f0] border border-[#c5d8c7] rounded-2xl mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      Parent Reflection:
                    </p>
                    <p className="text-gray-900">{log.parentReflection}</p>
                  </div>
                )}

                {/* Work Samples */}
                {log.workSampleIds.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-2">Attached Work Samples:</p>
                    <div className="flex gap-2">
                      {log.workSampleIds.map((wsId) => {
                        const sample = workSamples.find(ws => ws.id === wsId);
                        return sample ? (
                          <div key={wsId} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2">
                            {fileTypeIcons[sample.type]}
                            <span className="text-sm text-gray-700">{sample.title}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* WORK SAMPLES TAB */}
        {activeTab === 'samples' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Uploaded Work Samples</h2>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                Add New Sample
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workSamples.map((sample) => (
                <div key={sample.id} className="bg-white rounded-3xl p-4 shadow-sm">
                  <div className="aspect-video bg-gray-200 rounded-2xl mb-4 flex items-center justify-center">
                    {fileTypeIcons[sample.type]}
                    {sample.type === 'photo' && sample.thumbnail && (
                      <div className="text-sm text-gray-600">Photo Preview</div>
                    )}
                    {sample.type === 'video' && (
                      <div className="text-sm text-gray-600">Video Thumbnail</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{sample.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {sample.subject} • {new Date(sample.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sample.competencies.map((comp) => (
                      <span key={comp} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NIOS COMPETENCIES TAB */}
        {activeTab === 'competencies' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">NIOS Competency Mapping</h2>
              <p className="text-gray-600">Track progress against National Institute of Open Schooling standards</p>
            </div>

            <div className="space-y-4">
              {niosCompetencies.map((comp) => (
                <div key={comp.code} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {comp.code}
                        </span>
                        <span className="text-sm text-gray-600">{comp.evidenceCount} evidence pieces</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{comp.description}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{comp.progress}%</p>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${comp.progress >= 80 ? 'bg-green-500' :
                            comp.progress >= 60 ? 'bg-blue-500' :
                              'bg-orange-500'
                          }`}
                        style={{ width: `${comp.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARENT REFLECTIONS TAB */}
        {activeTab === 'reflections' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent Reflections</h2>
              <p className="text-gray-600">Document insights, observations, and progress notes</p>
            </div>

            <div className="space-y-4">
              {lessonLogs.filter(log => log.parentReflection).map((log) => (
                <div key={log.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    <span className="text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {log.subject}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{log.topic}</h3>
                  <div className="p-4 bg-[#f0f7f0] border border-[#c5d8c7] rounded-2xl">
                    <p className="text-gray-900">{log.parentReflection}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Work Sample</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center mb-6">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drag and drop files here</p>
              <p className="text-sm text-gray-600 mb-4">or click to browse</p>
              <input type="file" multiple className="hidden" id="file-upload" />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-[#9db4a0] text-white rounded-full font-medium cursor-pointer hover:bg-[#8ca394]"
              >
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-4">Supports: JPG, PNG, MP4, PDF (max 50MB)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none"
                  placeholder="e.g., Essay on My Family"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link to Lesson (Optional)</label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none">
                  <option value="">Select a lesson...</option>
                  {lessonLogs.map(log => (
                    <option key={log.id} value={log.id}>{log.date} - {log.topic}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleFileUpload(new FileList())}
                  className="flex-1 px-6 py-3 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Modal */}
      {reflectionModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Parent Reflection</h2>
              <button
                onClick={() => {
                  setReflectionModalOpen(false);
                  setSelectedLog(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">{selectedLog.date}</p>
              <h3 className="text-lg font-bold text-gray-900">{selectedLog.topic}</h3>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Reflection</label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none resize-none"
                rows={6}
                placeholder="What went well? What challenges did you observe? Any insights about your child's learning?"
                defaultValue={selectedLog.parentReflection || ''}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReflectionModalOpen(false);
                  setSelectedLog(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddReflection(selectedLog.id, 'New reflection text')}
                className="flex-1 px-6 py-3 bg-[#9db4a0] text-white rounded-full font-medium hover:bg-[#8ca394]"
              >
                Save Reflection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
