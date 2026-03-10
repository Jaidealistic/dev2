'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, FolderOpen, Users, FileText, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function HomeschoolNav() {
  const pathname = usePathname();

  const links = [
    { href: '/homeschool/hub', label: 'Hub', icon: Home },
    { href: '/homeschool/schedule', label: 'Schedule', icon: Calendar },
    { href: '/homeschool/portfolio', label: 'Portfolio', icon: FolderOpen },
    { href: '/homeschool/co-op', label: 'Co-op', icon: Users },
    { href: '/homeschool/nios', label: 'NIOS Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/homeschool/hub" aria-label="LexFix home">
              <Logo />
            </Link>

            <div className="flex gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
