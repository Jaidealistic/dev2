// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * LexFix Mock API Server
 * Per-language data model: streaks, lessons, progress separated per language
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'linguaaccess-dev-secret-key-2026';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

/* ─── Available languages in the platform ─── */
const AVAILABLE_LANGUAGES = ['English', 'Tamil'];

const LESSONS_BY_LANGUAGE: Record<string, any[]> = {
  English: [
    { id: 'l-1', title: 'Greetings & Introductions', language: 'English', difficulty: 'Beginner', duration: '15 min', category: 'Conversation', description: 'Learn common greetings and introductions' },
    { id: 'l-2', title: 'Numbers & Counting', language: 'English', difficulty: 'Beginner', duration: '20 min', category: 'Vocabulary', description: 'Count and use numbers in everyday situations' },
    { id: 'l-3', title: 'Colours & Shapes', language: 'English', difficulty: 'Beginner', duration: '15 min', category: 'Vocabulary', description: 'Learn colour and shape vocabulary' },
    { id: 'l-4', title: 'Family & Relationships', language: 'English', difficulty: 'Beginner', duration: '15 min', category: 'Vocabulary', description: 'Words for family members and relationships' },
    { id: 'l-5', title: 'Daily Routines', language: 'English', difficulty: 'Intermediate', duration: '25 min', category: 'Conversation', description: 'Describe your daily activities' },
    { id: 'l-6', title: 'Reading Comprehension', language: 'English', difficulty: 'Intermediate', duration: '20 min', category: 'Reading', description: 'Understand short paragraphs' },
    { id: 'l-7', title: 'Writing Short Paragraphs', language: 'English', difficulty: 'Intermediate', duration: '25 min', category: 'Writing', description: 'Write clear, simple paragraphs' },
    { id: 'l-8', title: 'English Grammar Basics', language: 'English', difficulty: 'Beginner', duration: '20 min', category: 'Grammar', description: 'Foundation grammar rules' },
  ],
  Tamil: [
    { id: 'l-9', title: 'Tamil Alphabets – Uyir', language: 'Tamil', difficulty: 'Beginner', duration: '20 min', category: 'Alphabet', description: 'Learn the foundational vowel letters' },
    { id: 'l-10', title: 'Tamil Alphabets – Mei', language: 'Tamil', difficulty: 'Beginner', duration: '20 min', category: 'Alphabet', description: 'Learn consonant letters' },
    { id: 'l-11', title: 'Basic Tamil Greetings', language: 'Tamil', difficulty: 'Beginner', duration: '15 min', category: 'Conversation', description: 'Common Tamil greetings' },
    { id: 'l-12', title: 'Numbers in Tamil', language: 'Tamil', difficulty: 'Beginner', duration: '15 min', category: 'Vocabulary', description: 'Count in Tamil' },
    { id: 'l-13', title: 'Colours in Tamil', language: 'Tamil', difficulty: 'Beginner', duration: '15 min', category: 'Vocabulary', description: 'Learn colour words in Tamil' },
    { id: 'l-14', title: 'Family Words in Tamil', language: 'Tamil', difficulty: 'Beginner', duration: '15 min', category: 'Vocabulary', description: 'Family member vocabulary in Tamil' },
    { id: 'l-15', title: 'Common Tamil Phrases', language: 'Tamil', difficulty: 'Intermediate', duration: '20 min', category: 'Conversation', description: 'Useful everyday phrases' },
    { id: 'l-16', title: 'Tamil Reading Practice', language: 'Tamil', difficulty: 'Intermediate', duration: '25 min', category: 'Reading', description: 'Read simple Tamil text' },
  ],
};

/* ─── Per-language stats helper ─── */
interface LanguageStats {
  currentStreak: number;
  longestStreak: number;
  totalLessons: number;
  completedLessons: number;
  wordsLearned: number;
  totalPracticeMinutes: number;
  currentGoal: string;
  goalProgress: number;
  recentLessons: any[];
  achievements: any[];
}

function createLanguageStats(language: string): LanguageStats {
  const lessonCount = (LESSONS_BY_LANGUAGE[language] || []).length;
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalLessons: lessonCount,
    completedLessons: 0,
    wordsLearned: 0,
    totalPracticeMinutes: 0,
    currentGoal: `Complete your first ${language} lesson`,
    goalProgress: 0,
    recentLessons: [],
    achievements: [
      { id: `${language.toLowerCase()}-ach-1`, title: 'First Steps', description: `Complete your first ${language} lesson`, earned: false },
      { id: `${language.toLowerCase()}-ach-2`, title: 'Streak Starter', description: `3-day ${language} learning streak`, earned: false },
      { id: `${language.toLowerCase()}-ach-3`, title: 'Word Collector', description: `Learn 50 ${language} words`, earned: false },
      { id: `${language.toLowerCase()}-ach-4`, title: 'Consistent', description: `7-day ${language} learning streak`, earned: false },
    ],
  };
}

interface User {
  id: string;
  email: string;
  password: string;
  pattern: string;
  firstName: string;
  lastName: string;
  role: 'LEARNER' | 'EDUCATOR' | 'PARENT';
  studentId: string;
  isEmailVerified: boolean;
  createdAt: string;
  onboardingComplete: boolean;
  nativeLanguage: string;
  learningLanguages: string[];
  languageGoals: Record<string, any>;
  languageStats: Record<string, LanguageStats>;
  gradeLevel: string;
  disabilities: string[];
  accessibility: any;
  linkedChildren: string[];
  /* Legacy flat fields — kept for backward compat, computed from languageStats */
  currentStreak: number;
  totalLessons: number;
  completedLessons: number;
  currentGoal: string;
  goalProgress: number;
  wordsLearned: number;
  totalPracticeMinutes: number;
  longestStreak: number;
  recentLessons: any[];
  achievements: any[];
}

interface DB { users: User[]; }

function loadDB(): DB {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (err) { console.error('DB load error:', err); }
  return { users: [] };
}

function saveDB(db: DB): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

let db = loadDB();

function generateId(): string {
  return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

function generateStudentId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'LXF-';
  for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)];
  if (db.users.some(u => u.studentId === id)) return generateStudentId();
  return id;
}

/** Aggregate stats across all languages */
function aggregateStats(u: User) {
  const stats = u.languageStats || {};
  const langs = Object.keys(stats);
  u.currentStreak = langs.length > 0 ? Math.max(...langs.map(l => stats[l].currentStreak)) : 0;
  u.longestStreak = langs.length > 0 ? Math.max(...langs.map(l => stats[l].longestStreak)) : 0;
  u.totalLessons = langs.reduce((s, l) => s + stats[l].totalLessons, 0);
  u.completedLessons = langs.reduce((s, l) => s + stats[l].completedLessons, 0);
  u.wordsLearned = langs.reduce((s, l) => s + stats[l].wordsLearned, 0);
  u.totalPracticeMinutes = langs.reduce((s, l) => s + stats[l].totalPracticeMinutes, 0);
  u.goalProgress = u.totalLessons > 0 ? Math.round((u.completedLessons / u.totalLessons) * 100) : 0;
  u.recentLessons = langs.flatMap(l => (stats[l].recentLessons || []).map((r: any) => ({ ...r, language: l }))).sort((a: any, b: any) => (b.completedAt || '').localeCompare(a.completedAt || '')).slice(0, 10);
  u.achievements = langs.flatMap(l => stats[l].achievements || []);
}

/** Migrate old users who don't have languageStats yet */
function migrateUser(u: User) {
  if (u.languageStats && Object.keys(u.languageStats).length > 0) return;
  u.languageStats = {};
  const langs = u.learningLanguages && u.learningLanguages.length > 0 ? u.learningLanguages : [];
  for (const lang of langs) {
    const langLessons = (u.recentLessons || []).filter((l: any) => l.language === lang);
    const stats = createLanguageStats(lang);
    stats.recentLessons = langLessons;
    stats.completedLessons = langLessons.filter((l: any) => l.status === 'completed').length;
    stats.goalProgress = stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0;
    u.languageStats[lang] = stats;
  }
  aggregateStats(u);
}

function createDefaultUserData(role: string): Partial<User> {
  return {
    currentStreak: 0, totalLessons: 0, completedLessons: 0,
    currentGoal: 'Complete your first lesson', goalProgress: 0,
    wordsLearned: 0, totalPracticeMinutes: 0, longestStreak: 0,
    recentLessons: [],
    achievements: [],
    languageStats: {},
    onboardingComplete: false, nativeLanguage: '', learningLanguages: [], languageGoals: {},
    gradeLevel: '', disabilities: [], accessibility: {},
    linkedChildren: [],
    studentId: role === 'LEARNER' ? generateStudentId() : '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthRequest extends Request { user?: any; }

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' }); return;
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) { res.status(401).json({ error: 'User not found' }); return; }
    migrateUser(user);
    req.user = user;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, _res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// AUTH
// ============================================

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { email, password, pattern, firstName, lastName, role } = req.body;
  const userRole = role || 'LEARNER';
  if (!email || !firstName || !lastName) return res.status(400).json({ error: 'Name and email required' });

  if (userRole === 'LEARNER') {
    if (!pattern || !Array.isArray(pattern) || pattern.length < 4)
      return res.status(400).json({ error: 'Pattern must connect at least 4 dots' });
  } else {
    if (!password || password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already registered' });

  const newUser: User = {
    ...createDefaultUserData(userRole),
    id: generateId(),
    email: email.toLowerCase(),
    password: userRole === 'LEARNER' ? '' : await bcrypt.hash(password, 10),
    pattern: userRole === 'LEARNER' ? JSON.stringify(pattern) : '',
    firstName, lastName, role: userRole,
    isEmailVerified: false, createdAt: new Date().toISOString(),
  } as User;

  db.users.push(newUser);
  saveDB(db);
  const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  console.log(`User created: ${newUser.firstName} (${newUser.role}) studentId: ${newUser.studentId}`);

  res.status(201).json({
    success: true, message: 'Account created!',
    user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, role: newUser.role, studentId: newUser.studentId, isEmailVerified: newUser.isEmailVerified },
    token,
  });
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password, pattern, rememberMe } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'No account found with this email' });

  if (user.role === 'LEARNER') {
    if (!pattern || !Array.isArray(pattern))
      return res.status(400).json({ error: 'Pattern is required for student login', authMethod: 'pattern' });
    if (JSON.stringify(pattern) !== user.pattern)
      return res.status(401).json({ error: 'Incorrect pattern. Please try again.' });
  } else {
    if (!password) return res.status(400).json({ error: 'Password is required', authMethod: 'password' });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: rememberMe ? '30d' : '7d' });
  res.json({
    success: true, message: 'Login successful!',
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, studentId: user.studentId, isEmailVerified: user.isEmailVerified, onboardingComplete: user.onboardingComplete },
    token,
  });
});

app.post('/api/auth/check-method', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: 'No account found' });
  res.json({ role: user.role, authMethod: user.role === 'LEARNER' ? 'pattern' : 'password', firstName: user.firstName });
});

app.post('/api/auth/verify-email', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isEmailVerified = true; saveDB(db);
  res.json({ success: true, message: 'Email verified!' });
});

app.get('/api/auth/me', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  aggregateStats(u);
  res.json({ user: { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, studentId: u.studentId, isEmailVerified: u.isEmailVerified, createdAt: u.createdAt, onboardingComplete: u.onboardingComplete, linkedChildren: u.linkedChildren, nativeLanguage: u.nativeLanguage, learningLanguages: u.learningLanguages, languageGoals: u.languageGoals, gradeLevel: u.gradeLevel, disabilities: u.disabilities, accessibility: u.accessibility, currentStreak: u.currentStreak, completedLessons: u.completedLessons, totalLessons: u.totalLessons, wordsLearned: u.wordsLearned, totalPracticeMinutes: u.totalPracticeMinutes } });
});

// ============================================
// ONBOARDING
// ============================================

app.put('/api/learner/onboarding', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const { nativeLanguage, learningLanguages, languageGoals, gradeLevel, disabilities, accessibility } = req.body;
  if (nativeLanguage) u.nativeLanguage = nativeLanguage;
  if (learningLanguages) {
    u.learningLanguages = learningLanguages;
    // Initialise per-language stats for each chosen language
    if (!u.languageStats) u.languageStats = {};
    for (const lang of learningLanguages) {
      if (!u.languageStats[lang]) {
        u.languageStats[lang] = createLanguageStats(lang);
      }
    }
    aggregateStats(u);
  }
  if (languageGoals) u.languageGoals = languageGoals;
  if (gradeLevel) u.gradeLevel = gradeLevel;
  if (disabilities) u.disabilities = disabilities;
  if (accessibility) u.accessibility = accessibility;
  u.onboardingComplete = true;
  saveDB(db);
  res.json({ success: true, studentId: u.studentId, message: 'Onboarding complete!' });
});

// ============================================
// LANGUAGE MANAGEMENT
// ============================================

/** Add a new language to the learner's list */
app.post('/api/learner/languages', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const { language } = req.body;
  if (!language) return res.status(400).json({ error: 'Language is required' });
  if (!AVAILABLE_LANGUAGES.includes(language)) return res.status(400).json({ error: `Language "${language}" is not available. Available: ${AVAILABLE_LANGUAGES.join(', ')}` });
  if (u.learningLanguages.includes(language)) return res.status(409).json({ error: `You are already learning ${language}` });

  u.learningLanguages.push(language);
  if (!u.languageStats) u.languageStats = {};
  u.languageStats[language] = createLanguageStats(language);
  aggregateStats(u);
  saveDB(db);
  res.json({ success: true, learningLanguages: u.learningLanguages, languageStats: u.languageStats[language] });
});

/** Remove a language */
app.delete('/api/learner/languages/:language', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const { language } = req.params;
  if (u.learningLanguages.length <= 1) return res.status(400).json({ error: 'You must keep at least one language' });
  u.learningLanguages = u.learningLanguages.filter(l => l !== language);
  if (u.languageStats) delete u.languageStats[language];
  if (u.languageGoals) delete u.languageGoals[language];
  aggregateStats(u);
  saveDB(db);
  res.json({ success: true, learningLanguages: u.learningLanguages });
});

/** Get available languages to add */
app.get('/api/learner/available-languages', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const available = AVAILABLE_LANGUAGES.filter(l => !u.learningLanguages.includes(l));
  res.json({ available, all: AVAILABLE_LANGUAGES });
});

// ============================================
// LEARNER ENDPOINTS
// ============================================

app.get('/api/learner/dashboard', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  aggregateStats(u);

  // Build per-language dashboard data
  const perLanguage: Record<string, any> = {};
  for (const lang of u.learningLanguages) {
    const ls = u.languageStats?.[lang] || createLanguageStats(lang);
    perLanguage[lang] = {
      currentStreak: ls.currentStreak,
      longestStreak: ls.longestStreak,
      totalLessons: ls.totalLessons,
      completedLessons: ls.completedLessons,
      wordsLearned: ls.wordsLearned,
      totalPracticeMinutes: ls.totalPracticeMinutes,
      currentGoal: ls.currentGoal,
      goalProgress: ls.goalProgress,
      recentLessons: ls.recentLessons,
      achievements: ls.achievements,
    };
  }

  res.json({
    learnerName: u.firstName,
    studentId: u.studentId,
    learningLanguages: u.learningLanguages || [],
    languageGoals: u.languageGoals || {},
    perLanguage,
    // Aggregated totals
    currentStreak: u.currentStreak,
    totalLessons: u.totalLessons,
    completedLessons: u.completedLessons,
    currentGoal: u.currentGoal || 'Complete your first lesson',
    goalProgress: u.goalProgress,
    recentLessons: u.recentLessons,
    achievements: u.achievements,
    availableLanguages: AVAILABLE_LANGUAGES.filter(l => !u.learningLanguages.includes(l)),
  });
});

app.get('/api/learner/lessons', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const langFilter = req.query.language as string | undefined;

  const langs = langFilter ? [langFilter] : u.learningLanguages;
  const lessons: any[] = [];
  for (const lang of langs) {
    const langLessons = LESSONS_BY_LANGUAGE[lang] || [];
    const langStats = u.languageStats?.[lang];
    const recentMap = new Map((langStats?.recentLessons || []).map((l: any) => [l.id, l]));
    for (const l of langLessons) {
      const rec = recentMap.get(l.id);
      lessons.push({ ...l, progress: rec?.progress || 0, status: rec?.status || 'not-started' });
    }
  }
  res.json({ lessons, totalCount: lessons.length });
});

app.get('/api/learner/progress', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  aggregateStats(u);

  const perLanguage: Record<string, any> = {};
  for (const lang of u.learningLanguages) {
    const ls = u.languageStats?.[lang] || createLanguageStats(lang);
    perLanguage[lang] = {
      totalLessons: ls.totalLessons,
      completedLessons: ls.completedLessons,
      currentStreak: ls.currentStreak,
      longestStreak: ls.longestStreak,
      wordsLearned: ls.wordsLearned,
      totalPracticeMinutes: ls.totalPracticeMinutes,
      goalProgress: ls.goalProgress,
    };
  }

  res.json({
    overallProgress: u.goalProgress, totalLessons: u.totalLessons, completedLessons: u.completedLessons,
    totalPracticeMinutes: u.totalPracticeMinutes, wordsLearned: u.wordsLearned,
    currentStreak: u.currentStreak, longestStreak: u.longestStreak,
    perLanguage,
    weeklyActivity: [{ day: 'Mon', minutes: 0 },{ day: 'Tue', minutes: 0 },{ day: 'Wed', minutes: 0 },{ day: 'Thu', minutes: 0 },{ day: 'Fri', minutes: 0 },{ day: 'Sat', minutes: 0 },{ day: 'Sun', minutes: 0 }],
    skillBreakdown: [{ skill: 'Reading', level: 1, progress: 0 },{ skill: 'Listening', level: 1, progress: 0 },{ skill: 'Speaking', level: 1, progress: 0 },{ skill: 'Writing', level: 1, progress: 0 }],
  });
});

app.post('/api/learner/lessons/:lessonId/complete', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const { lessonId } = req.params;
  const { score } = req.body;

  // Determine which language this lesson belongs to
  let lessonLang = '';
  for (const [lang, lessons] of Object.entries(LESSONS_BY_LANGUAGE)) {
    if (lessons.some(l => l.id === lessonId)) { lessonLang = lang; break; }
  }
  if (!lessonLang) return res.status(404).json({ error: 'Lesson not found' });

  // Get or create language stats
  if (!u.languageStats) u.languageStats = {};
  if (!u.languageStats[lessonLang]) u.languageStats[lessonLang] = createLanguageStats(lessonLang);
  const ls = u.languageStats[lessonLang];

  const lessonMeta = LESSONS_BY_LANGUAGE[lessonLang].find(l => l.id === lessonId);
  const rec = { id: lessonId, title: lessonMeta?.title || lessonId, progress: 100, status: 'completed', completedAt: new Date().toISOString(), score: score || 85, language: lessonLang };

  const idx = ls.recentLessons.findIndex((l: any) => l.id === lessonId);
  if (idx >= 0) ls.recentLessons[idx] = { ...ls.recentLessons[idx], ...rec };
  else ls.recentLessons.unshift(rec);

  ls.completedLessons = ls.recentLessons.filter((l: any) => l.status === 'completed').length;
  ls.goalProgress = ls.totalLessons > 0 ? Math.round((ls.completedLessons / ls.totalLessons) * 100) : 0;
  ls.currentStreak += 1;
  ls.longestStreak = Math.max(ls.longestStreak, ls.currentStreak);
  ls.wordsLearned += Math.floor(Math.random() * 10) + 5;
  ls.totalPracticeMinutes += 15;

  // Achievements for this language
  if (ls.completedLessons >= 1) { const a = ls.achievements.find((a: any) => a.id.endsWith('-ach-1')); if (a) a.earned = true; }
  if (ls.currentStreak >= 3) { const a = ls.achievements.find((a: any) => a.id.endsWith('-ach-2')); if (a) a.earned = true; }
  if (ls.wordsLearned >= 50) { const a = ls.achievements.find((a: any) => a.id.endsWith('-ach-3')); if (a) a.earned = true; }
  if (ls.currentStreak >= 7) { const a = ls.achievements.find((a: any) => a.id.endsWith('-ach-4')); if (a) a.earned = true; }

  aggregateStats(u);
  saveDB(db);
  res.json({ success: true, language: lessonLang, updatedStats: { completedLessons: ls.completedLessons, currentStreak: ls.currentStreak, wordsLearned: ls.wordsLearned, goalProgress: ls.goalProgress } });
});

app.post('/api/learner/accessibility', authMiddleware as any, (req: AuthRequest, res: Response) => {
  req.user!.accessibility = req.body; saveDB(db); res.json({ success: true });
});
app.put('/api/learner/accessibility', authMiddleware as any, (req: AuthRequest, res: Response) => {
  req.user!.accessibility = req.body; saveDB(db); res.json({ success: true });
});

app.get('/api/learner/settings', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  res.json({ studentId: u.studentId, firstName: u.firstName, lastName: u.lastName, email: u.email, gradeLevel: u.gradeLevel, nativeLanguage: u.nativeLanguage, learningLanguages: u.learningLanguages, disabilities: u.disabilities, accessibility: u.accessibility });
});

app.put('/api/learner/settings', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const body = req.body;
  if (body.firstName) u.firstName = body.firstName;
  if (body.lastName) u.lastName = body.lastName;
  if (body.gradeLevel) u.gradeLevel = body.gradeLevel;
  if (body.nativeLanguage) u.nativeLanguage = body.nativeLanguage;
  if (body.learningLanguages) u.learningLanguages = body.learningLanguages;
  if (body.disabilities) u.disabilities = body.disabilities;
  u.accessibility = {
    ...(u.accessibility || {}),
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    lineSpacing: body.lineSpacing,
    letterSpacing: body.letterSpacing,
    colorScheme: body.colorScheme,
    reducedMotion: body.reducedMotion,
    captionsEnabled: body.captionsEnabled,
    speechRecognition: body.speechRecognition,
  };
  saveDB(db);
  res.json({ success: true, message: 'Settings saved' });
});

// ============================================
// PARENT
// ============================================

app.post('/api/parent/link-child', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const parent = req.user!;
  const { studentId } = req.body;
  if (parent.role !== 'PARENT') return res.status(403).json({ error: 'Only parents can link children' });
  if (!studentId) return res.status(400).json({ error: 'Student ID is required' });
  const child = db.users.find(u => u.studentId === studentId && u.role === 'LEARNER');
  if (!child) return res.status(404).json({ error: 'No student found with this ID' });
  if (!parent.linkedChildren) parent.linkedChildren = [];
  if (parent.linkedChildren.includes(studentId)) return res.status(409).json({ error: 'Already linked' });
  parent.linkedChildren.push(studentId);
  saveDB(db);
  res.json({ success: true, child: { studentId: child.studentId, firstName: child.firstName, lastName: child.lastName, gradeLevel: child.gradeLevel } });
});

app.put('/api/parent/onboarding', authMiddleware as any, (req: AuthRequest, res: Response) => {
  req.user!.onboardingComplete = true; saveDB(db);
  res.json({ success: true });
});

app.get('/api/parent/dashboard', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const u = req.user!;
  const childIds = u.linkedChildren || [];
  const children = db.users.filter(c => childIds.includes(c.studentId));
  res.json({
    parentName: u.firstName,
    children: children.map(c => {
      migrateUser(c); aggregateStats(c);
      return {
        studentId: c.studentId, name: `${c.firstName} ${c.lastName}`, gradeLevel: c.gradeLevel,
        currentStreak: c.currentStreak, totalLessons: c.totalLessons, completedLessons: c.completedLessons,
        goalProgress: c.goalProgress, wordsLearned: c.wordsLearned,
        learningLanguages: c.learningLanguages || [],
        recentActivity: c.recentLessons.length > 0 ? `Completed "${c.recentLessons[0]?.title}"` : 'No recent activity',
        lastActive: c.recentLessons[0]?.completedAt || c.createdAt,
      };
    }),
    weeklyReport: {
      totalMinutes: children.reduce((s, c) => s + (c.totalPracticeMinutes || 0), 0),
      lessonsCompleted: children.reduce((s, c) => s + (c.completedLessons || 0), 0),
      newWordsLearned: children.reduce((s, c) => s + (c.wordsLearned || 0), 0),
    },
  });
});

// ============================================
// ASSESSMENT
// ============================================

app.post('/api/assessment/submit', authMiddleware as any, (_req: AuthRequest, res: Response) => {
  res.json({ success: true, assessmentId: 'assess-' + Date.now(), assessment: { placementLevel: 'Beginner', score: 72, strengths: ['Visual learning', 'Pattern recognition'], areasForImprovement: ['Pronunciation', 'Listening'] } });
});
app.post('/api/assessment/generate-path', authMiddleware as any, (_req: AuthRequest, res: Response) => {
  res.json({ success: true, path: { id: 'path-1', name: 'Language Foundations', totalLessons: 16, estimatedWeeks: 8, modules: [{ id: 'mod-1', name: 'English Basics', lessonCount: 4 },{ id: 'mod-2', name: 'English Intermediate', lessonCount: 4 },{ id: 'mod-3', name: 'Tamil Basics', lessonCount: 4 },{ id: 'mod-4', name: 'Tamil Intermediate', lessonCount: 4 }] } });
});

// ============================================
// HEALTH & FALLBACK
// ============================================

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'LexFix API', users: db.users.length });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`\nLexFix API running on http://localhost:${PORT}`);
  console.log(`${db.users.length} registered users\n`);
});

export default app;
