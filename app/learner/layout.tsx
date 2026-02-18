'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function LearnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return null; // or a loading spinner
    }

    return (
        <LanguageProvider>
            <ToastProvider>
                <div className="min-h-screen bg-slate-50">
                    {/* Learner Navigation could go here */}
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </ToastProvider>
        </LanguageProvider>
    );
}
