import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// INTERFACES
// ============================================

export interface ILesson extends Document {
  lessonId: string;
  title: {
    en: string;
    ta: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'en' | 'ta';
  estimatedDuration: number;
  prepTimeMinutes: number;
  content: ILessonContent;
  teachingGuide: ITeachingGuide;
  niosCompetencies: string[];
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'private' | 'school' | 'public';
  tags: string[];
  difficulty: number;
  thumbnail?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ILessonContent {
  introduction: {
    text: { en: string; ta: string };
    audioUrl?: { en?: string; ta?: string };
    videoUrl?: string;
    imageUrl?: string;
  };
  sections: ILessonSection[];
}

interface ILessonSection {
  type: 'vocabulary' | 'grammar' | 'practice' | 'quiz' | 'reading' | 'listening' | 'writing';
  sectionId: string;
  title?: { en: string; ta: string };
  items: any[];
  instructions?: { en: string; ta: string };
}

interface ITeachingGuide {
  overview: {
    en: string;
    ta: string;
  };
  learningObjectives: {
    en: string[];
    ta: string[];
  };
  steps: ITeachingStep[];
  assessmentCriteria?: {
    en: string;
    ta: string;
  };
  extensionActivities?: {
    en: string[];
    ta: string[];
  };
}

interface ITeachingStep {
  stepNumber: number;
  title: string;
  durationMinutes: number;
  script: string;
  materialsNeeded: string[];
  adaptations: {
    dyslexia?: string;
    adhd?: string;
    autism?: string;
    apd?: string;
  };
  visualAids?: string[];
  checkForUnderstanding?: string;
  troubleshooting?: string[];
}

// ============================================
// MONGOOSE SCHEMAS
// ============================================

const TeachingStepSchema = new Schema<ITeachingStep>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    script: { type: String, required: true },
    materialsNeeded: [{ type: String }],
    adaptations: {
      dyslexia: { type: String },
      adhd: { type: String },
      autism: { type: String },
      apd: { type: String },
    },
    visualAids: [{ type: String }],
    checkForUnderstanding: { type: String },
    troubleshooting: [{ type: String }],
  },
  { _id: false }
);

const TeachingGuideSchema = new Schema<ITeachingGuide>(
  {
    overview: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    learningObjectives: {
      en: [{ type: String }],
      ta: [{ type: String }],
    },
    steps: [TeachingStepSchema],
    assessmentCriteria: {
      en: { type: String },
      ta: { type: String },
    },
    extensionActivities: {
      en: [{ type: String }],
      ta: [{ type: String }],
    },
  },
  { _id: false }
);

const LessonSectionSchema = new Schema<ILessonSection>(
  {
    type: {
      type: String,
      enum: ['vocabulary', 'grammar', 'practice', 'quiz', 'reading', 'listening', 'writing'],
      required: true,
    },
    sectionId: { type: String, required: true },
    title: {
      en: { type: String },
      ta: { type: String },
    },
    items: { type: Schema.Types.Mixed, required: true },
    instructions: {
      en: { type: String },
      ta: { type: String },
    },
  },
  { _id: false }
);

const LessonContentSchema = new Schema<ILessonContent>(
  {
    introduction: {
      text: {
        en: { type: String, required: true },
        ta: { type: String, required: true },
      },
      audioUrl: {
        en: { type: String },
        ta: { type: String },
      },
      videoUrl: { type: String },
      imageUrl: { type: String },
    },
    sections: [LessonSectionSchema],
  },
  { _id: false }
);

const LessonSchema = new Schema<ILesson>(
  {
    lessonId: { type: String, required: true, unique: true },
    title: {
      en: { type: String, required: true },
      ta: { type: String, required: true },
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    language: {
      type: String,
      enum: ['en', 'ta'],
      required: true,
    },
    estimatedDuration: { type: Number, required: true },
    prepTimeMinutes: { type: Number, default: 0 },
    content: { type: LessonContentSchema, required: true },
    teachingGuide: { type: TeachingGuideSchema, required: true },
    niosCompetencies: [{ type: String }],
    createdBy: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['private', 'school', 'public'],
      default: 'private',
    },
    tags: [{ type: String }],
    difficulty: { type: Number, min: 1, max: 10, default: 5 },
    thumbnail: { type: String },
    version: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// ============================================
// INDEXES
// ============================================

LessonSchema.index({ lessonId: 1 });
LessonSchema.index({ createdBy: 1 });
LessonSchema.index({ status: 1, visibility: 1 });
LessonSchema.index({ level: 1, language: 1 });
LessonSchema.index({ tags: 1 });
LessonSchema.index({ createdAt: -1 });

// ============================================
// EXPORT
// ============================================

const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;