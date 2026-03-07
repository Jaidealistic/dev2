'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function ContentModeration() {
  return (
    <div className="bg-card p-8 rounded-lg border space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg mb-1">Content Management</h3>
          <p className="text-sm text-muted-foreground italic">Manage platform lessons and materials</p>
        </div>
        <Button asChild className="bg-[#7a9b7e] hover:bg-[#6b8c6f]">
          <Link href="/admin/content/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Lesson
          </Link>
        </Button>
      </div>

      <div className="p-12 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
        <Upload className="h-12 w-12 mx-auto mb-4 text-slate-300" />
        <h4 className="font-medium text-slate-900 mb-2">Build your curriculum</h4>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
          You can now upload lessons in JSON format. This allows for deep schema validation
          for special education needs and bilingual content.
        </p>
        <Button variant="outline" asChild>
          <Link href="/admin/content/upload">Go to Upload Tool</Link>
        </Button>
      </div>
    </div>
  );
}
