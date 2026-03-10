'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Upload, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { logout as legacyLogout } from '@/lib/api';
import Logo from '@/components/ui/Logo';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface AdminHeaderProps {
    title?: string;
    description?: string;
    showUpload?: boolean;
}

export default function AdminHeader({
    title = "Admin Dashboard",
    description = "Platform administration and monitoring",
    showUpload = true
}: AdminHeaderProps) {
    const { t } = useLanguage();

    const handleSignOut = async () => {
        // Clear legacy token
        legacyLogout();
        // Sign out from NextAuth
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <header role="banner" className="bg-white border-b border-[#e8e5e0] fixed top-0 left-0 w-full z-50">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" aria-label="LexFix home">
                        <Logo />
                    </Link>
                    <div className="w-px h-5 bg-[#e8e5e0] mx-1" />
                    <div>
                        <h1 className="text-lg font-semibold text-[#2d2d2d] leading-none">
                            {t('admin.dashboard')}
                        </h1>
                        <p className="text-xs text-[#8a8a8a] mt-1">
                            Platform administration and monitoring
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {showUpload && (
                        <Button asChild className="bg-[#7a9b7e] hover:bg-[#6b8c6f] text-white rounded-xl text-sm font-medium shadow-sm transition-all active:scale-[0.98]">
                            <Link href="/admin/content/upload">
                                <Upload className="mr-2 h-4 w-4" />
                                {t('common.upload') || 'Upload Lesson'}
                            </Link>
                        </Button>
                    )}

                    <div className="w-px h-5 bg-[#e8e5e0] mx-1" />

                    <button
                        onClick={handleSignOut}
                        className="text-sm text-[#8a8a8a] hover:text-[#c27171] transition-colors font-medium px-2 py-1"
                    >
                        {t('nav.signOut')}
                    </button>
                </div>
            </div>
        </header>
    );
}
