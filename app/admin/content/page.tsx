import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function ContentManagementPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button asChild className="bg-[#7a9b7e] hover:bg-[#6b8c6f]">
          <Link href="/admin/content/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Lesson
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Library</CardTitle>
          <CardDescription>Manage and update existing lessons in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            <p className="mb-4">No published lessons found.</p>
            <Button variant="outline" asChild>
              <Link href="/admin/content/upload">Start by uploading your first lesson</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
