/**
 * SPEECH RECOGNITION UTILITY
 *
 * Wraps the Web Speech API (SpeechRecognition) with:
 * - Cross-browser support (webkit prefix fallback)
 * - TypeScript types
 * - Promise-based API for one-shot recognition
 * - Continuous recognition mode for practice sessions
 * - Language switching (English / Tamil)
 * - Error handling with user-friendly messages
 * - Google Cloud Speech fallback stub
 *
 * Used by: Pronunciation practice, lesson speech exercises
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  /** BCP-47 language code, default 'en-US' */
  language?: string;
  /** Keep listening after each result, default false */
  continuous?: boolean;
  /** Return interim (partial) results, default true */
  interimResults?: boolean;
  /** Max alternative transcriptions, default 1 */
  maxAlternatives?: number;
}

export type SpeechRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface SpeechRecognitionError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

// ---------------------------------------------------------------------------
// Browser support check
// ---------------------------------------------------------------------------

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

function getSpeechRecognitionConstructor(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------

const ERROR_MAP: Record<string, string> = {
  'no-speech': 'No speech was detected. Please try again and speak clearly.',
  'audio-capture': 'No microphone found. Please check your microphone settings.',
  'not-allowed': 'Microphone access was denied. Please allow microphone permissions in your browser.',
  aborted: 'Speech recognition was stopped.',
  network: 'A network error occurred. Please check your internet connection.',
  'service-not-allowed': 'Speech recognition service is not allowed. Please try again later.',
  'language-not-supported': 'The selected language is not supported for speech recognition.',
};

function mapError(errorEvent: any): SpeechRecognitionError {
  const code: string = errorEvent?.error ?? 'unknown';
  return {
    code,
    message: errorEvent?.message ?? code,
    userFriendlyMessage:
      ERROR_MAP[code] ?? 'An unexpected error occurred with speech recognition. Please try again.',
  };
}

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'ta-IN', label: 'Tamil (India)' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// ---------------------------------------------------------------------------
// One-shot recognition (promise-based)
// ---------------------------------------------------------------------------

/**
 * Perform a single speech recognition and return the best transcript.
 *
 * ```ts
 * const result = await recognizeSpeech({ language: 'en-US' });
 * console.log(result.transcript, result.confidence);
 * ```
 */
export function recognizeSpeech(
  options: SpeechRecognitionOptions = {},
): Promise<SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      return reject({
        code: 'not-supported',
        message: 'SpeechRecognition API not supported',
        userFriendlyMessage:
          'Your browser does not support speech recognition. Please use Chrome or Edge.',
      } satisfies SpeechRecognitionError);
    }

    const recognition = new Ctor();
    recognition.lang = options.language ?? 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = options.maxAlternatives ?? 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      resolve({
        transcript: result.transcript,
        confidence: result.confidence,
        isFinal: true,
      });
    };

    recognition.onerror = (event: any) => {
      reject(mapError(event));
    };

    recognition.onnomatch = () => {
      reject({
        code: 'no-match',
        message: 'No match found',
        userFriendlyMessage: 'Could not understand your speech. Please try again more clearly.',
      } satisfies SpeechRecognitionError);
    };

    recognition.start();
  });
}

// ---------------------------------------------------------------------------
// Continuous recognition controller (class-based)
// ---------------------------------------------------------------------------

export class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private _status: SpeechRecognitionStatus = 'idle';
  private _onResult: ((result: SpeechRecognitionResult) => void) | null = null;
  private _onError: ((error: SpeechRecognitionError) => void) | null = null;
  private _onStatusChange: ((status: SpeechRecognitionStatus) => void) | null = null;
  private _onEnd: (() => void) | null = null;
  private autoRestart = false;

  constructor(private options: SpeechRecognitionOptions = {}) {}

  // ---- Event setters ----
  onResult(cb: (result: SpeechRecognitionResult) => void) {
    this._onResult = cb;
    return this;
  }
  onError(cb: (error: SpeechRecognitionError) => void) {
    this._onError = cb;
    return this;
  }
  onStatusChange(cb: (status: SpeechRecognitionStatus) => void) {
    this._onStatusChange = cb;
    return this;
  }
  onEnd(cb: () => void) {
    this._onEnd = cb;
    return this;
  }

  get status() {
    return this._status;
  }

  get isListening() {
    return this._status === 'listening';
  }

  // ---- Lifecycle ----

  start() {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      this.setStatus('error');
      this._onError?.({
        code: 'not-supported',
        message: 'Not supported',
        userFriendlyMessage: 'Speech recognition is not supported in this browser.',
      });
      return;
    }

    this.recognition = new Ctor();
    this.recognition.lang = this.options.language ?? 'en-US';
    this.recognition.continuous = this.options.continuous ?? true;
    this.recognition.interimResults = this.options.interimResults ?? true;
    this.recognition.maxAlternatives = this.options.maxAlternatives ?? 1;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        this._onResult?.({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      const error = mapError(event);
      // Suppress "aborted" errors when intentionally stopping
      if (error.code === 'aborted' && !this.autoRestart) return;
      this.setStatus('error');
      this._onError?.(error);
    };

    this.recognition.onend = () => {
      if (this.autoRestart && this._status === 'listening') {
        // Auto-restart for continuous mode
        try {
          this.recognition?.start();
        } catch {
          this.setStatus('idle');
          this._onEnd?.();
        }
        return;
      }
      this.setStatus('idle');
      this._onEnd?.();
    };

    this.recognition.onstart = () => {
      this.setStatus('listening');
    };

    this.autoRestart = this.options.continuous ?? false;

    try {
      this.recognition.start();
    } catch (e) {
      this.setStatus('error');
      this._onError?.({
        code: 'start-failed',
        message: String(e),
        userFriendlyMessage: 'Failed to start speech recognition. Please try again.',
      });
    }
  }

  stop() {
    this.autoRestart = false;
    try {
      this.recognition?.stop();
    } catch {
      // already stopped
    }
    this.setStatus('idle');
  }

  abort() {
    this.autoRestart = false;
    try {
      this.recognition?.abort();
    } catch {
      // already aborted
    }
    this.setStatus('idle');
  }

  /** Change language while running */
  setLanguage(lang: string) {
    this.options.language = lang;
    if (this.isListening) {
      this.stop();
      setTimeout(() => this.start(), 100);
    }
  }

  private setStatus(status: SpeechRecognitionStatus) {
    this._status = status;
    this._onStatusChange?.(status);
  }
}

// ---------------------------------------------------------------------------
// Pronunciation scoring helpers
// ---------------------------------------------------------------------------

/**
 * Simple Levenshtein-based similarity score between two strings.
 * Returns 0–100 where 100 = perfect match.
 */
export function calculatePronunciationScore(spoken: string, expected: string): number {
  const s = spoken.toLowerCase().trim();
  const e = expected.toLowerCase().trim();
  if (s === e) return 100;
  if (!s || !e) return 0;

  const distance = levenshteinDistance(s, e);
  const maxLen = Math.max(s.length, e.length);
  return Math.max(0, Math.round((1 - distance / maxLen) * 100));
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

/**
 * Identify specific word-level errors between spoken and expected text.
 */
export function identifyPronunciationErrors(
  spoken: string,
  expected: string,
): { word: string; expected: string; type: 'missing' | 'wrong' | 'extra' }[] {
  const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
  const expectedWords = expected.toLowerCase().trim().split(/\s+/);
  const errors: { word: string; expected: string; type: 'missing' | 'wrong' | 'extra' }[] = [];

  const maxLen = Math.max(spokenWords.length, expectedWords.length);
  for (let i = 0; i < maxLen; i++) {
    const sw = spokenWords[i];
    const ew = expectedWords[i];
    if (!sw && ew) {
      errors.push({ word: '', expected: ew, type: 'missing' });
    } else if (sw && !ew) {
      errors.push({ word: sw, expected: '', type: 'extra' });
    } else if (sw !== ew) {
      errors.push({ word: sw!, expected: ew!, type: 'wrong' });
    }
  }

  return errors;
}

/**
 * Generate user-friendly feedback based on score.
 * Designed to be encouraging and non-shaming (autism/dyslexia friendly).
 */
export function generateFeedback(score: number): {
  message: string;
  level: 'excellent' | 'good' | 'close' | 'tryagain';
  emoji: string;
} {
  if (score >= 90) {
    return { message: 'Excellent pronunciation! You got it!', level: 'excellent', emoji: '🌟' };
  }
  if (score >= 70) {
    return { message: 'Very good! Almost perfect!', level: 'good', emoji: '👏' };
  }
  if (score >= 50) {
    return { message: 'Good effort! Try listening to the word again.', level: 'close', emoji: '💪' };
  }
  return {
    message: "Let's practice this one more time. You're doing great!",
    level: 'tryagain',
    emoji: '🔄',
  };
}
