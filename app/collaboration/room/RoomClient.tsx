'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

export default function RoomClient() {
    const router = useRouter();
    const params = useSearchParams();
    const roomName = params?.get('name') || 'Collaboration Room';

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

    return (
        <div className="h-screen flex flex-col bg-[#faf9f7]">
            {/* Header */}
            <header className="border-b border-[#e8e5e0] bg-white px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/collaboration')} className="text-[#6b6b6b] hover:text-[#2d2d2d]">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-sm font-semibold text-[#2d2d2d]">{roomName}</h1>
                        <p className="text-[10px] text-[#8a8a8a]">{participants.filter(p => p.isActive).length} participants online</p>
                    </div>
                </div>
                {/* Turn-taking indicator (autism-friendly) */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f0] rounded-full">
                    <Hand className="w-3.5 h-3.5 text-[#7a9b7e]" />
                    <span className="text-[10px] font-medium text-[#5d7e61]">
                        {participants[turnOrder]?.name}&apos;s turn to speak
                    </span>
                    <button onClick={() => setTurnOrder((turnOrder + 1) % participants.length)} className="text-[#7a9b7e] hover:text-[#5d7e61]">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main area: Chat or Whiteboard */}
                <div className="flex-1 flex flex-col">
                    {/* Tab bar */}
                    <div className="flex bg-white border-b border-[#e8e5e0] px-4">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'chat' ? 'border-[#7a9b7e] text-[#5d7e61]' : 'border-transparent text-[#8a8a8a] hover:text-[#6b6b6b]'}`}
                        >
                            <MessageCircle className="w-3.5 h-3.5" /> Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('whiteboard')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'whiteboard' ? 'border-[#7a9b7e] text-[#5d7e61]' : 'border-transparent text-[#8a8a8a] hover:text-[#6b6b6b]'}`}
                        >
                            <Pencil className="w-3.5 h-3.5" /> Whiteboard
                        </button>
                    </div>

                    {activeTab === 'chat' ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                                        {msg.isSystem ? (
                                            <div className="w-full text-center">
                                                <span className="text-[10px] text-[#8a8a8a] bg-[#f0ede8] px-3 py-1 rounded-full">{msg.text}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-8 h-8 rounded-full bg-[#f0f4f0] flex items-center justify-center text-sm shrink-0">
                                                    {msg.user === 'You' ? '👤' : msg.user[0]}
                                                </div>
                                                <div className={`max-w-[70%] ${msg.user === 'You' ? 'text-right' : ''}`}>
                                                    <p className="text-[10px] text-[#8a8a8a] mb-0.5">{msg.user} · {msg.time}</p>
                                                    <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${msg.user === 'You' ? 'bg-[#7a9b7e] text-white' : 'bg-white border border-[#e8e5e0] text-[#2d2d2d]'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            {/* Chat input */}
                            <div className="border-t border-[#e8e5e0] bg-white p-3 flex gap-2">
                                <input
                                    type="text" value={input} onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm focus:ring-2 focus:ring-[#7a9b7e] outline-none"
                                />
                                <button onClick={sendMessage} disabled={!input.trim()} className="p-2.5 bg-[#7a9b7e] text-white rounded-xl hover:bg-[#6b8c6f] disabled:opacity-40 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Whiteboard */}
                            <div className="flex-1 relative bg-white">
                                <canvas
                                    ref={canvasRef}
                                    width={800} height={500}
                                    className="w-full h-full cursor-crosshair"
                                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                                />
                            </div>
                            {/* Whiteboard toolbar */}
                            <div className="border-t border-[#e8e5e0] bg-white p-3 flex items-center gap-3">
                                <div className="flex gap-1">
                                    {COLORS.map(c => (
                                        <button key={c} onClick={() => setBrushColor(c)}
                                            className={`w-7 h-7 rounded-full border-2 transition-all ${brushColor === c ? 'border-[#2d2d2d] scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }} aria-label={`Color ${c}`} />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Circle className="w-3 h-3 text-[#8a8a8a]" />
                                    <input type="range" min={1} max={12} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-20" />
                                </div>
                                <button onClick={clearCanvas} className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs text-[#6b6b6b] bg-[#f0ede8] rounded-lg hover:bg-[#e8e5e0]">
                                    <Eraser className="w-3.5 h-3.5" /> Clear
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Participants sidebar */}
                <aside className="w-48 border-l border-[#e8e5e0] bg-white p-4 hidden md:block">
                    <h3 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wide mb-3">Participants</h3>
                    <div className="space-y-2">
                        {participants.map(p => (
                            <div key={p.id} className="flex items-center gap-2">
                                <div className="relative">
                                    <span className="text-lg">{p.avatar}</span>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${p.isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
                                </div>
                                <span className={`text-xs font-medium ${p.isActive ? 'text-[#2d2d2d]' : 'text-[#8a8a8a]'}`}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
