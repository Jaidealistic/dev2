'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Upload, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { logout as legacyLogout } from '@/lib/api';
import Logo from '@/components/ui/Logo';

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
                            {title}
                        </h1>
                        <p className="text-xs text-[#8a8a8a] mt-1">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {showUpload && (
                        <Button asChild className="bg-[#5a8c5c] hover:bg-[#4a7c4c]">
                            <Link href="/admin/content/upload">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Lesson
                            </Link>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
}
