/**
 * SPEECH RECORDER COMPONENT
 *
 * Microphone recording UI with:
 * - Permission request handling
 * - Recording state visual feedback (pulsing ring)
 * - Integration with SpeechRecognizer from lib/speech-recognition
 * - WaveformVisualizer integration
 * - Countdown before recording starts
 * - Max recording duration limit
 * - Accessible labels & keyboard control
 *
 * Used by: Pronunciation practice, lesson speech exercises
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Square, Loader2, AlertCircle } from 'lucide-react';
import {
  SpeechRecognizer,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  isSpeechRecognitionSupported,
} from '@/lib/speech-recognition';
import { WaveformVisualizer } from './WaveformVisualizer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SpeechRecorderProps {
  /** BCP-47 language code */
  language?: string;
  /** Called with the best transcript when recording finishes */
  onResult: (result: SpeechRecognitionResult) => void;
  /** Called on error */
  onError?: (error: SpeechRecognitionError) => void;
  /** Max recording duration in seconds (0 = unlimited) */
  maxDuration?: number;
  /** Show the waveform visualizer */
  showWaveform?: boolean;
  /** Show countdown before recording, default false */
  countdown?: boolean;
  /** Label text for the record button */
  label?: string;
  /** Compact mode (smaller button) */
  compact?: boolean;
}

type RecorderState = 'idle' | 'countdown' | 'recording' | 'processing' | 'error' | 'unsupported';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SpeechRecorder({
  language = 'en-US',
  onResult,
  onError,
  maxDuration = 10,
  showWaveform = true,
  countdown = false,
  label = 'Record',
  compact = false,
}: SpeechRecorderProps) {
  const [state, setState] = useState<RecorderState>(
    isSpeechRecognitionSupported() ? 'idle' : 'unsupported',
  );
  const [countdownValue, setCountdownValue] = useState(3);
  const [transcript, setTranscript] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognizerRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
      if (durationRef.current) clearTimeout(durationRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start recording flow
  const handleStart = useCallback(async () => {
    setErrorMessage('');
    setTranscript('');

    // Request mic stream for waveform
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
    } catch {
      // Mic denied – still try speech recognition (may work via browser)
    }

    if (countdown) {
      setState('countdown');
      let count = 3;
      setCountdownValue(count);
      timerRef.current = setInterval(() => {
        count--;
        setCountdownValue(count);
        if (count <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRecognition();
        }
      }, 1000);
    } else {
      startRecognition();
    }
  }, [countdown, language, maxDuration]);

  const startRecognition = useCallback(() => {
    setState('recording');

    const recognizer = new SpeechRecognizer({
      language,
      continuous: false,
      interimResults: true,
    });

    recognizer
      .onResult((result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setState('idle');
          onResult(result);
          stopMic();
        }
      })
      .onError((err) => {
        setState('error');
        setErrorMessage(err.userFriendlyMessage);
        onError?.(err);
        stopMic();
      })
      .onEnd(() => {
        if (state === 'recording') {
          setState('idle');
          stopMic();
        }
      });

    recognizer.start();
    recognizerRef.current = recognizer;

    // Auto-stop after max duration
    if (maxDuration > 0) {
      durationRef.current = setTimeout(() => {
        handleStop();
      }, maxDuration * 1000);
    }
  }, [language, maxDuration, onResult, onError]);

  const handleStop = useCallback(() => {
    recognizerRef.current?.stop();
    if (durationRef.current) clearTimeout(durationRef.current);
    setState('idle');
    stopMic();
  }, []);

  const stopMic = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (state === 'unsupported') {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>
          Speech recognition is not supported in your browser. Please use Chrome or Edge.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Waveform */}
      {showWaveform && (
        <WaveformVisualizer
          isRecording={state === 'recording'}
          stream={stream}
          height={64}
          mode="bars"
        />
      )}

      {/* Record button */}
      <div className="flex items-center gap-3">
        {state === 'countdown' ? (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">{countdownValue}</span>
            </div>
            <span className="text-sm text-gray-600">Get ready...</span>
          </div>
        ) : state === 'recording' ? (
          <button
            onClick={handleStop}
            className={`flex items-center gap-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors ${
              compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'
            }`}
            aria-label="Stop recording"
          >
            <div className="relative">
              <Square className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
              {/* Pulsing recording indicator */}
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-300 rounded-full animate-ping"
                aria-hidden="true"
              />
            </div>
            Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={state === 'processing'}
            className={`flex items-center gap-2 font-medium text-white bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors ${
              compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'
            }`}
            aria-label={label}
          >
            {state === 'processing' ? (
              <Loader2 className={`animate-spin ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            ) : (
              <Mic className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            )}
            {label}
          </button>
        )}

        {/* Live transcript */}
        {state === 'recording' && transcript && (
          <p className="text-sm text-gray-600 italic flex-1 truncate">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
      </div>

      {/* Error */}
      {state === 'error' && errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default SpeechRecorder;
