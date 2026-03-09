'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Upload, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { logout as legacyLogout } from '@/lib/api';

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
        <header className="bg-card border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-[#5a8c5c] hover:text-[#4a7c4c] transition-colors">
                            <LayoutDashboard className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground">
                            {title}
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground ml-10">
                        {description}
                    </p>
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
