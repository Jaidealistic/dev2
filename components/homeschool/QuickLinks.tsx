import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FolderOpen, Users, FileText } from 'lucide-react';

export default function QuickLinks() {
  const links = [
    { href: '/homeschool/schedule', label: 'Weekly Planner', icon: Calendar },
    { href: '/homeschool/portfolio', label: 'Portfolio', icon: FolderOpen },
    { href: '/homeschool/co-op', label: 'Co-op', icon: Users },
    { href: '/homeschool/nios', label: 'NIOS Reports', icon: FileText },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-8 w-8 text-blue-600 mb-2" aria-hidden="true" />
                <span className="text-sm font-medium text-center">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
