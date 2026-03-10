import { Suspense } from 'react';
import RoomClient from './RoomClient';

/**
 * COLLABORATION ROOM — Real-Time Chat + Whiteboard
 *
 * Features:
 *  - Chat panel with message history
 *  - Shared whiteboard canvas
 *  - Participant presence sidebar
 *  - Structured turn-taking cues for autism mode
 */

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, Pencil, Eraser, Users as UsersIcon,
  MessageCircle, Palette, Circle, Hand, Mic, MicOff, ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  isSpeaking: boolean;
}

const COLORS = ['#2d2d2d', '#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6'];

function CollaborationRoomContent() {
  const router = useRouter();
  const params = useSearchParams();
  const roomName = params.get('name') || 'Collaboration Room';

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: `Welcome to ${roomName}! Be respectful and have fun learning together.`, time: 'now', isSystem: true },
    { id: '2', user: 'Ananya', text: 'Hi everyone! Ready to practice?', time: '2m ago' },
    { id: '3', user: 'Ravi', text: 'Yes! Let\'s start with greetings today.', time: '1m ago' },
  ]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard'>('chat');
  const [brushColor, setBrushColor] = useState('#2d2d2d');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [turnOrder, setTurnOrder] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const participants: Participant[] = [
    { id: '1', name: 'You', avatar: '👤', isActive: true, isSpeaking: false },
    { id: '2', name: 'Ananya', avatar: '👩', isActive: true, isSpeaking: false },
    { id: '3', name: 'Ravi', avatar: '👦', isActive: true, isSpeaking: false },
    { id: '4', name: 'Priya', avatar: '👧', isActive: false, isSpeaking: false },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Canvas drawing */
  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = { x, y };
  }, [isDrawing, brushColor, brushSize]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      user: 'You',
      text: input,
      time: 'now',
    }]);
    setInput('');
  };

export default function CollaborationRoomPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#faf9f7] text-[#6b6b6b]">Loading Room...</div>}>
      <RoomClient />
    </Suspense>
  );
}

export default function CollaborationRoom() {
  return (
    <Suspense fallback={<div className="h-screen flex flex-col bg-[#faf9f7] items-center justify-center text-[#8a8a8a] text-sm">Loading room...</div>}>
      <CollaborationRoomContent />
    </Suspense>
  );
}
