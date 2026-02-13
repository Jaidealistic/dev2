import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ContentList from '@/components/content/ContentList';

import { redirect } from 'next/navigation';

export default async function ContentPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Content</h1>
          <p className="text-gray-600">Create and manage lessons</p>
        </div>
        <Button asChild>
          <Link href="/educator/content/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Link>
        </Button>
      </div>

      <ContentList educatorId={session.user.id || ''} />
    </div>
  );
}
