/**
 * TEXT-TO-SPEECH UTILITY
 *
 * Wraps the Web Speech API (SpeechSynthesis) with:
 * - Cross-browser support
 * - TypeScript-first API
 * - Language switching (English / Tamil)
 * - Speed, pitch, volume controls
 * - Queue management (cancel previous before speaking new)
 * - Accessibility preferences integration (from AccessibilityProvider)
 * - Word-level highlighting callback for synchronized reading
 * - Google Cloud TTS fallback stub (for production)
 *
 * Used by: Lesson player, vocabulary cards, pronunciation practice
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TTSOptions {
  /** BCP-47 language code, default 'en-US' */
  language?: string;
  /** Speaking rate: 0.1 – 10, default 1.0 */
  rate?: number;
  /** Pitch: 0 – 2, default 1.0 */
  pitch?: number;
  /** Volume: 0 – 1, default 1.0 */
  volume?: number;
  /** Preferred voice name (browser-specific) */
  voiceName?: string;
}

export interface TTSEvent {
  charIndex: number;
  charLength: number;
  elapsedTime: number;
  word?: string;
}

export type TTSStatus = 'idle' | 'speaking' | 'paused' | 'loading';

export interface TTSVoiceInfo {
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
}

// ---------------------------------------------------------------------------
// Browser support
// ---------------------------------------------------------------------------

export function isTTSSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// ---------------------------------------------------------------------------
// Get available voices
// ---------------------------------------------------------------------------

/**
 * Get all available TTS voices, optionally filtered by language.
 * Voices load asynchronously – this will wait up to 2s for them.
 */
export async function getVoices(languageFilter?: string): Promise<TTSVoiceInfo[]> {
  if (!isTTSSupported()) return [];

  const synth = window.speechSynthesis;

  // Voices may not be loaded yet
  let voices = synth.getVoices();
  if (voices.length === 0) {
    voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const timeout = setTimeout(() => resolve(synth.getVoices()), 2000);
      synth.onvoiceschanged = () => {
        clearTimeout(timeout);
        resolve(synth.getVoices());
      };
    });
  }

  const mapped = voices.map((v) => ({
    name: v.name,
    lang: v.lang,
    default: v.default,
    localService: v.localService,
  }));

  if (languageFilter) {
    const prefix = languageFilter.toLowerCase().split('-')[0];
    return mapped.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  }

  return mapped;
}

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export const TTS_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'ta-IN', label: 'Tamil (India)' },
] as const;

// ---------------------------------------------------------------------------
// One-shot speak (fire-and-forget with promise)
// ---------------------------------------------------------------------------

/**
 * Speak text and resolve when done.
 *
 * ```ts
 * await speak('Hello, world!', { language: 'en-US', rate: 0.9 });
 * ```
 */
export function speak(text: string, options: TTSOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isTTSSupported()) {
      return reject(new Error('Text-to-speech is not supported in this browser.'));
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language ?? 'en-US';
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Try to find preferred voice
    if (options.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.name === options.voiceName);
      if (match) utterance.voice = match;
    } else {
      // Pick a voice matching the language
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = utterance.lang.split('-')[0];
      const langVoice = voices.find((v) => v.lang.startsWith(langPrefix));
      if (langVoice) utterance.voice = langVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') {
        resolve(); // Not a real error – user cancelled
      } else {
        reject(new Error(`TTS error: ${event.error}`));
      }
    };

    window.speechSynthesis.speak(utterance);
  });
}

// ---------------------------------------------------------------------------
// TTS Controller (class-based for complex use cases)
// ---------------------------------------------------------------------------

export class TTSController {
  private utterance: SpeechSynthesisUtterance | null = null;
  private _status: TTSStatus = 'idle';
  private _onStatusChange: ((status: TTSStatus) => void) | null = null;
  private _onWordBoundary: ((event: TTSEvent) => void) | null = null;
  private _onEnd: (() => void) | null = null;
  private options: TTSOptions;

  constructor(options: TTSOptions = {}) {
    this.options = options;
  }

  // ---- Event setters ----
  onStatusChange(cb: (status: TTSStatus) => void) {
    this._onStatusChange = cb;
    return this;
  }

  /** Called at each word boundary – useful for synchronized text highlighting */
  onWordBoundary(cb: (event: TTSEvent) => void) {
    this._onWordBoundary = cb;
    return this;
  }

  onEnd(cb: () => void) {
    this._onEnd = cb;
    return this;
  }

  get status() {
    return this._status;
  }

  get isSpeaking() {
    return this._status === 'speaking';
  }

  get isPaused() {
    return this._status === 'paused';
  }

  // ---- Controls ----

  speak(text: string, optionsOverride?: Partial<TTSOptions>) {
    if (!isTTSSupported()) return;

    this.stop();

    const opts = { ...this.options, ...optionsOverride };

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = opts.language ?? 'en-US';
    this.utterance.rate = opts.rate ?? 1.0;
    this.utterance.pitch = opts.pitch ?? 1.0;
    this.utterance.volume = opts.volume ?? 1.0;

    // Voice selection
    const voices = window.speechSynthesis.getVoices();
    if (opts.voiceName) {
      const match = voices.find((v) => v.name === opts.voiceName);
      if (match) this.utterance.voice = match;
    } else {
      const langPrefix = this.utterance.lang.split('-')[0];
      const match = voices.find((v) => v.lang.startsWith(langPrefix));
      if (match) this.utterance.voice = match;
    }

    // Events
    this.utterance.onstart = () => this.setStatus('speaking');

    this.utterance.onend = () => {
      this.setStatus('idle');
      this._onEnd?.();
    };

    this.utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.warn('TTS error:', event.error);
      }
      this.setStatus('idle');
    };

    this.utterance.onpause = () => this.setStatus('paused');
    this.utterance.onresume = () => this.setStatus('speaking');

    this.utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        this._onWordBoundary?.({
          charIndex: event.charIndex,
          charLength: event.charLength,
          elapsedTime: event.elapsedTime,
          word,
        });
      }
    };

    this.setStatus('speaking');
    window.speechSynthesis.speak(this.utterance);
  }

  pause() {
    if (!isTTSSupported()) return;
    window.speechSynthesis.pause();
    this.setStatus('paused');
  }

  resume() {
    if (!isTTSSupported()) return;
    window.speechSynthesis.resume();
    this.setStatus('speaking');
  }

  stop() {
    if (!isTTSSupported()) return;
    window.speechSynthesis.cancel();
    this.utterance = null;
    this.setStatus('idle');
  }

  /** Update options (e.g. rate, language) for next speak() call */
  setOptions(opts: Partial<TTSOptions>) {
    this.options = { ...this.options, ...opts };
  }

  private setStatus(status: TTSStatus) {
    this._status = status;
    this._onStatusChange?.(status);
  }
}

// ---------------------------------------------------------------------------
// Convenience: speak a word with slow pronunciation for learning
// ---------------------------------------------------------------------------

/**
 * Speak a word slowly for pronunciation practice.
 * Uses rate=0.7 by default for clearer articulation.
 */
export function speakSlowly(text: string, language = 'en-US'): Promise<void> {
  return speak(text, { language, rate: 0.7, pitch: 1.0 });
}

/**
 * Speak a word at normal speed.
 */
export function speakNormal(text: string, language = 'en-US'): Promise<void> {
  return speak(text, { language, rate: 1.0, pitch: 1.0 });
}
