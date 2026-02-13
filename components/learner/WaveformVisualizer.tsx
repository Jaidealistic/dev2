/**
 * WAVEFORM VISUALIZER
 *
 * Real-time audio waveform display using the Web Audio API (AnalyserNode).
 * Shows live microphone input as an animated waveform bar chart.
 *
 * Features:
 * - Real-time frequency bars OR time-domain waveform
 * - Colour-coded by amplitude (calm greens at low volume)
 * - Accessible: aria-label describes current state
 * - Reduced-motion: falls back to static amplitude indicator
 * - Clean canvas rendering at 30fps
 *
 * Used by: Pronunciation practice page
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { Mic, MicOff } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WaveformVisualizerProps {
  /** Whether the microphone is currently active */
  isRecording: boolean;
  /** Visual style: 'bars' (frequency) or 'wave' (time-domain) */
  mode?: 'bars' | 'wave';
  /** Height in pixels */
  height?: number;
  /** Width: CSS value (e.g. '100%', '400px') */
  width?: string;
  /** Provide an external MediaStream (mic stream) – if omitted, component requests its own */
  stream?: MediaStream | null;
  /** Colour for the bars/wave. Defaults to theme green. */
  color?: string;
  /** Background colour */
  bgColor?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WaveformVisualizer({
  isRecording,
  mode = 'bars',
  height = 80,
  width = '100%',
  stream: externalStream,
  color = '#7da47f',
  bgColor = '#f0f7f0',
}: WaveformVisualizerProps) {
  const { preferences } = useAccessibility();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [amplitude, setAmplitude] = useState(0);

  // Setup / teardown audio analyser
  useEffect(() => {
    if (!isRecording) {
      cleanup();
      return;
    }

    async function setup() {
      try {
        const mediaStream = externalStream ?? (await navigator.mediaDevices.getUserMedia({ audio: true }));
        streamRef.current = mediaStream;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = mode === 'bars' ? 128 : 2048;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyserRef.current = analyser;

        draw();
      } catch (err) {
        console.warn('WaveformVisualizer: could not access mic', err);
      }
    }

    setup();

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, externalStream, mode]);

  function cleanup() {
    cancelAnimationFrame(animationRef.current);
    if (audioCtxRef.current?.state !== 'closed') {
      audioCtxRef.current?.close().catch(() => {});
    }
    // Only stop tracks if we created the stream ourselves
    if (!externalStream && streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    analyserRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;
    setAmplitude(0);
  }

  // ---------------------------------------------------------------------------
  // Drawing loop
  // ---------------------------------------------------------------------------

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    function renderFrame() {
      if (!analyser || !ctx) return;

      animationRef.current = requestAnimationFrame(renderFrame);

      // Clear
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      if (mode === 'bars') {
        const bufferLength = analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(data);

        // Calculate average amplitude for accessibility
        const avg = data.reduce((sum, v) => sum + v, 0) / bufferLength;
        setAmplitude(Math.round((avg / 255) * 100));

        const barWidth = (w / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (data[i] / 255) * h;
          const ratio = data[i] / 255;

          // Gradient from soft green to stronger green based on amplitude
          const r = Math.round(125 + ratio * 0);
          const g = Math.round(164 + ratio * 20);
          const b = Math.round(127 + ratio * 0);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

          const yPos = h - barHeight;
          ctx.beginPath();
          ctx.roundRect(x, yPos, barWidth - 1, barHeight, 2);
          ctx.fill();

          x += barWidth;
          if (x > w) break;
        }
      } else {
        // Waveform (time-domain)
        const bufferLength = analyser.fftSize;
        const data = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(data);

        const avg = data.reduce((sum, v) => sum + Math.abs(v - 128), 0) / bufferLength;
        setAmplitude(Math.round((avg / 128) * 100));

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.beginPath();

        const sliceWidth = w / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = data[i] / 128.0;
          const y = (v * h) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }
    }

    renderFrame();
  }, [bgColor, color, mode]);

  // ---------------------------------------------------------------------------
  // Reduced-motion fallback: simple amplitude bar
  // ---------------------------------------------------------------------------

  if (preferences.reducedMotion) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl border border-[#c5d8c7]"
        style={{ backgroundColor: bgColor, height, width }}
        role="status"
        aria-label={
          isRecording
            ? `Recording — volume level ${amplitude}%`
            : 'Microphone inactive'
        }
      >
        {isRecording ? (
          <Mic className="w-5 h-5 text-[#5a8c5c] flex-shrink-0" />
        ) : (
          <MicOff className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7da47f] rounded-full transition-all duration-300"
            style={{ width: `${isRecording ? amplitude : 0}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 tabular-nums w-8 text-right">
          {isRecording ? `${amplitude}%` : '—'}
        </span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full canvas visualizer
  // ---------------------------------------------------------------------------

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#c5d8c7]"
      style={{ width, height }}
      role="status"
      aria-label={
        isRecording
          ? `Recording — volume level ${amplitude}%`
          : 'Microphone inactive'
      }
    >
      {isRecording ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-2 text-gray-400">
            <MicOff className="w-5 h-5" />
            <span className="text-sm">Click record to start</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaveformVisualizer;
