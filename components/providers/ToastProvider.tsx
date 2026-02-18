/**
 * TOAST NOTIFICATION SYSTEM
 *
 * Global, accessible, ADHD-safe toast notifications.
 * - Soft, non-jarring animations
 * - Auto-dismiss with configurable duration
 * - Types: success, error, info, warning
 * - Stacks up to 3 toasts, oldest auto-removed
 * - WCAG AA: role="status" / role="alert"
 */

'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────── */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number; // ms, default 4000
}

interface ToastContextType {
    toasts: Toast[];
    toast: (opts: Omit<Toast, 'id'>) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    dismiss: (id: string) => void;
}

/* ── Context ────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

/* ── Provider ───────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((opts: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const duration = opts.duration ?? 4000;

        setToasts(prev => {
            // Keep max 3 toasts — remove oldest if needed
            const next = prev.length >= 3 ? prev.slice(1) : prev;
            return [...next, { ...opts, id }];
        });

        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
    }, [dismiss]);

    const success = useCallback((title: string, message?: string) =>
        toast({ type: 'success', title, message }), [toast]);
    const error = useCallback((title: string, message?: string) =>
        toast({ type: 'error', title, message, duration: 6000 }), [toast]);
    const info = useCallback((title: string, message?: string) =>
        toast({ type: 'info', title, message }), [toast]);
    const warning = useCallback((title: string, message?: string) =>
        toast({ type: 'warning', title, message }), [toast]);

    return (
        <ToastContext.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </ToastContext.Provider>
    );
}

/* ── Visual config per type ─────────────────────────────────────── */

const CONFIG: Record<ToastType, {
    icon: React.ReactNode;
    bar: string;
    bg: string;
    border: string;
    title: string;
}> = {
    success: {
        icon: <CheckCircle className="w-4 h-4 text-[#5d7e61]" />,
        bar: 'bg-[#7a9b7e]',
        bg: 'bg-[#f0f4f0]',
        border: 'border-[#c5d9c7]',
        title: 'text-[#2d4a30]',
    },
    error: {
        icon: <XCircle className="w-4 h-4 text-[#c27171]" />,
        bar: 'bg-[#c27171]',
        bg: 'bg-[#fdf0f0]',
        border: 'border-[#e8c5c5]',
        title: 'text-[#7a2a2a]',
    },
    info: {
        icon: <Info className="w-4 h-4 text-[#5a7a94]" />,
        bar: 'bg-[#7a9bb5]',
        bg: 'bg-[#f0f4f8]',
        border: 'border-[#c5d4e0]',
        title: 'text-[#2a4a5e]',
    },
    warning: {
        icon: <AlertTriangle className="w-4 h-4 text-[#9a7a3a]" />,
        bar: 'bg-[#c4a44a]',
        bg: 'bg-[#fdf8ee]',
        border: 'border-[#e0d0a0]',
        title: 'text-[#5e4a10]',
    },
};

/* ── Container + individual toast ───────────────────────────────── */

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;
    return (
        <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
            style={{ maxWidth: 'min(360px, calc(100vw - 2rem))' }}
        >
            {toasts.map(t => (
                <ToastItem key={t.id} toast={t} dismiss={dismiss} />
            ))}
        </div>
    );
}

function ToastItem({ toast: t, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
    const cfg = CONFIG[t.type];

    return (
        <div
            role={t.type === 'error' ? 'alert' : 'status'}
            className={`
        pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg
        ${cfg.bg} ${cfg.border}
        animate-in slide-in-from-bottom-3 fade-in duration-300
      `}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
        >
            {/* Coloured left bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

            <div className="flex items-start gap-3 px-4 py-3 pl-5">
                <span className="mt-0.5 flex-shrink-0">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${cfg.title}`}>{t.title}</p>
                    {t.message && (
                        <p className="text-xs text-[#6b6b6b] mt-0.5 leading-relaxed">{t.message}</p>
                    )}
                </div>
                <button
                    onClick={() => dismiss(t.id)}
                    className="flex-shrink-0 mt-0.5 p-0.5 rounded text-[#8a8a8a] hover:text-[#2d2d2d] transition-colors"
                    aria-label="Dismiss notification"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
