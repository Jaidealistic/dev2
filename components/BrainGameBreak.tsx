/**
 * BRAIN GAME BREAK
 *
 * Quick 10-second brain games for students who need a
 * motivational micro-break during lessons.
 *
 * Games:
 *  1. Emoji Match — find the matching pair
 *  2. Quick Math — solve simple problems
 *  3. Color Word — Stroop test
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Gamepad2, Trophy, Sparkles, Zap } from 'lucide-react';

/* ─────────── types ─────────── */
type GameType = 'emoji' | 'math' | 'color';

interface BrainGameBreakProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ─────────── constants ─────────── */
const GAME_DURATION = 10; // seconds

const ALL_EMOJI = ['🐶', '🐱', '🦊', '🐸', '🐵', '🦁', '🐼', '🐨', '🐯', '🦄', '🐙', '🦋', '🐢', '🐬', '🦜', '🐝'];

const COLORS: { name: string; hex: string }[] = [
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Orange', hex: '#f97316' },
];

const MOTIVATIONAL = [
    '🔥 Great job! You crushed it!',
    '🌟 Your brain is warmed up!',
    '💪 Ready to learn again!',
    "🚀 Let's keep the momentum!",
    '🧠 Brain recharged!',
    "⚡ You're on fire!",
];

/* ─────────── helpers ─────────── */
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export function BrainGameBreak({ isOpen, onClose }: BrainGameBreakProps) {
    const [phase, setPhase] = useState<'pick' | 'playing' | 'done'>('pick');
    const [gameType, setGameType] = useState<GameType>('emoji');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // reset on open
    useEffect(() => {
        if (isOpen) {
            setPhase('pick');
            setTimeLeft(GAME_DURATION);
            setScore(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isOpen]);

    // manual end of game
    const handleEndGame = () => {
        setPhase('done');
    };

    function startGame(type: GameType) {
        setGameType(type);
        setTimeLeft(GAME_DURATION);
        setScore(0);
        setPhase('playing');
    }

    if (!isOpen) return null;

    const progress = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md mx-4 bg-[#f4f7f4] rounded-3xl shadow-2xl overflow-hidden border border-[#7da47f]/10">
                {/* close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>

                {/* ─── PICK SCREEN ─── */}
                {phase === 'pick' && (
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-4 shadow-md border border-[#7da47f]/10">
                            <Gamepad2 className="w-8 h-8 text-[#5a8c5c]" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#3a6d3c] mb-1">Brain Break! 🎮</h2>
                        <p className="text-sm text-gray-500 mb-6">Pick a 10-second mini-game</p>

                        <div className="grid gap-3">
                            {/* Emoji Match */}
                            <button
                                onClick={() => startGame('emoji')}
                                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] transition-all text-left group"
                            >
                                <span className="text-3xl">🧩</span>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-[#3a6d3c]">Emoji Match</p>
                                    <p className="text-xs text-gray-500">Find matching pairs</p>
                                </div>
                                <Zap className="w-5 h-5 text-yellow-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                            </button>

                            {/* Quick Math */}
                            <button
                                onClick={() => startGame('math')}
                                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] transition-all text-left group"
                            >
                                <span className="text-3xl">🔢</span>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-[#3a6d3c]">Quick Math</p>
                                    <p className="text-xs text-gray-500">Solve fast arithmetic</p>
                                </div>
                                <Zap className="w-5 h-5 text-yellow-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                            </button>

                            {/* Color Word */}
                            <button
                                onClick={() => startGame('color')}
                                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#7da47f]/50 hover:bg-[#f0f7f0] transition-all text-left group"
                            >
                                <span className="text-3xl">🎨</span>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-[#3a6d3c]">Color Word</p>
                                    <p className="text-xs text-gray-500">Stroop challenge</p>
                                </div>
                                <Zap className="w-5 h-5 text-yellow-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── PLAYING SCREEN ─── */}
                {phase === 'playing' && (
                    <div className="p-6">
                        {/* End Break Button */}
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-gray-700">Take your time!</h3>
                            <button onClick={handleEndGame} className="text-sm font-bold text-[#5a8c5c] hover:bg-[#f0f7f0] px-3 py-1.5 rounded-full transition-colors">
                                End Break
                            </button>
                        </div>

                        {/* Score */}
                        <div className="text-center mb-4">
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5a8c5c] bg-[#f0f7f0] px-3 py-1 rounded-full">
                                <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> {score}
                            </span>
                        </div>

                        {/* Game area */}
                        {gameType === 'emoji' && <EmojiMatchGame score={score} setScore={setScore} />}
                        {gameType === 'math' && <QuickMathGame score={score} setScore={setScore} />}
                        {gameType === 'color' && <ColorWordGame score={score} setScore={setScore} />}
                    </div>
                )}

                {/* ─── DONE SCREEN ─── */}
                {phase === 'done' && (
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] mb-4 shadow-lg shadow-green-200/50">
                            <Trophy className="w-8 h-8 text-white" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {score >= 5 ? '🏆 Amazing!' : score >= 3 ? '⭐ Great!' : '👏 Nice try!'}
                        </h2>
                        <p className="text-4xl font-black text-[#5a8c5c] my-3">{score} pts</p>
                        <p className="text-sm text-gray-500 mb-6">{pick(MOTIVATIONAL)}</p>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#7da47f] to-[#5a8c5c] text-white font-bold text-sm hover:shadow-lg hover:shadow-green-200/40 transition-all active:scale-95"
                        >
                            <span className="flex items-center gap-2">
                                Back to Lesson <Sparkles className="w-4 h-4" aria-hidden="true" />
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   GAME 1 — EMOJI MATCH
   ═══════════════════════════════════════════════════ */
function EmojiMatchGame({
    score,
    setScore,
}: {
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [cards, setCards] = useState<{ emoji: string; id: number; flipped: boolean; matched: boolean }[]>([]);
    const [selected, setSelected] = useState<number[]>([]);

    const generateBoard = useCallback(() => {
        const chosen = shuffle(ALL_EMOJI).slice(0, 4); // 4 pairs = 8 cards
        const deck = shuffle([...chosen, ...chosen].map((emoji, i) => ({
            emoji,
            id: i,
            flipped: false,
            matched: false,
        })));
        setCards(deck);
        setSelected([]);
    }, []);

    useEffect(() => { generateBoard(); }, [generateBoard]);

    function handleCardClick(idx: number) {
        if (cards[idx].flipped || cards[idx].matched || selected.length >= 2) return;

        const newCards = [...cards];
        newCards[idx].flipped = true;
        setCards(newCards);

        const newSel = [...selected, idx];
        setSelected(newSel);

        if (newSel.length === 2) {
            const [a, b] = newSel;
            if (newCards[a].emoji === newCards[b].emoji) {
                newCards[a].matched = true;
                newCards[b].matched = true;
                setCards([...newCards]);
                setScore(s => s + 1);
                setSelected([]);
                // regenerate if all matched
                if (newCards.every(c => c.matched)) {
                    setTimeout(generateBoard, 400);
                }
            } else {
                setTimeout(() => {
                    newCards[a].flipped = false;
                    newCards[b].flipped = false;
                    setCards([...newCards]);
                    setSelected([]);
                }, 500);
            }
        }
    }

    return (
        <div className="grid grid-cols-4 gap-2">
            {cards.map((card, idx) => (
                <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-200 ${card.matched
                        ? 'bg-[#f0f7f0] border-2 border-[#7da47f]/40 scale-90 opacity-60'
                        : card.flipped
                            ? 'bg-[#f0f7f0] border-2 border-[#7da47f]/60 scale-105'
                            : 'bg-gray-100 border-2 border-gray-200 hover:bg-[#f0f7f0] hover:border-[#7da47f]/40 hover:scale-105 cursor-pointer'
                        }`}
                >
                    {card.flipped || card.matched ? card.emoji : '?'}
                </button>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   GAME 2 — QUICK MATH
   ═══════════════════════════════════════════════════ */
function QuickMathGame({
    score,
    setScore,
}: {
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [problem, setProblem] = useState({ q: '', answer: 0, options: [0] });
    const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

    const generateProblem = useCallback(() => {
        const ops = ['+', '-', '×'];
        const op = pick(ops);
        let a: number, b: number, answer: number;

        if (op === '+') {
            a = randomInt(1, 20);
            b = randomInt(1, 20);
            answer = a + b;
        } else if (op === '-') {
            a = randomInt(5, 30);
            b = randomInt(1, a);
            answer = a - b;
        } else {
            a = randomInt(2, 9);
            b = randomInt(2, 9);
            answer = a * b;
        }

        // generate 3 wrong options
        const wrongSet = new Set<number>();
        while (wrongSet.size < 3) {
            const wrong = answer + randomInt(-5, 5);
            if (wrong !== answer && wrong >= 0) wrongSet.add(wrong);
        }

        setProblem({
            q: `${a} ${op} ${b}`,
            answer,
            options: shuffle([answer, ...Array.from(wrongSet)]),
        });
    }, []);

    useEffect(() => { generateProblem(); }, [generateProblem]);

    function handleAnswer(val: number) {
        if (val === problem.answer) {
            setScore(s => s + 1);
            setFlash('correct');
        } else {
            setFlash('wrong');
        }
        setTimeout(() => {
            setFlash(null);
            generateProblem();
        }, 300);
    }

    return (
        <div className="text-center">
            <div
                className={`text-4xl font-black mb-6 transition-colors duration-200 ${flash === 'correct' ? 'text-[#5a8c5c]' : flash === 'wrong' ? 'text-rose-500' : 'text-gray-900'
                    }`}
            >
                {problem.q} = ?
            </div>
            <div className="grid grid-cols-2 gap-3">
                {problem.options.map((opt, i) =>
                    <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="py-4 rounded-2xl border-2 border-gray-200 text-xl font-bold text-gray-800 hover:bg-[#f0f7f0] hover:border-[#7da47f]/40 active:scale-95 transition-all"
                    >
                        {opt}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   GAME 3 — COLOR WORD (Stroop)
   ═══════════════════════════════════════════════════ */
function ColorWordGame({
    score,
    setScore,
}: {
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [challenge, setChallenge] = useState({ word: '', wordColor: '', correctColor: '' });
    const [options, setOptions] = useState<{ name: string; hex: string }[]>([]);
    const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

    const generate = useCallback(() => {
        // pick a word (color name) and a DIFFERENT display color
        const wordColor = pick(COLORS);
        let displayColor = pick(COLORS);
        while (displayColor.name === wordColor.name) displayColor = pick(COLORS);

        // correct answer = the COLOR the word is displayed in (not what it says)
        const correct = displayColor;

        // 3 wrong choices
        const wrongSet = new Set<string>([wordColor.name, correct.name]);
        const wrongs: typeof COLORS = [];
        while (wrongs.length < 2) {
            const c = pick(COLORS);
            if (!wrongSet.has(c.name)) {
                wrongs.push(c);
                wrongSet.add(c.name);
            }
        }

        setChallenge({
            word: wordColor.name,
            wordColor: displayColor.hex,
            correctColor: correct.name,
        });
        setOptions(shuffle([correct, ...wrongs]));
    }, []);

    useEffect(() => { generate(); }, [generate]);

    function handlePick(name: string) {
        if (name === challenge.correctColor) {
            setScore(s => s + 1);
            setFlash('correct');
        } else {
            setFlash('wrong');
        }
        setTimeout(() => {
            setFlash(null);
            generate();
        }, 300);
    }

    return (
        <div className="text-center">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                Tap the color the word is <u>displayed</u> in
            </p>
            <div
                className={`text-5xl font-black mb-6 transition-transform duration-200 ${flash === 'correct' ? 'scale-110' : flash === 'wrong' ? 'scale-90' : ''
                    }`}
                style={{ color: challenge.wordColor }}
            >
                {challenge.word}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.name}
                        onClick={() => handlePick(opt.name)}
                        className="py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                        style={{ backgroundColor: opt.hex + '18', color: opt.hex, borderColor: opt.hex + '40' }}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
