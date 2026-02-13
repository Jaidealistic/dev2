import fs from 'node:fs';
import path from 'node:path';

const emptyFiles = fs.readFileSync('empty_files_list.txt', 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && fs.existsSync(line));

console.log(`Found ${emptyFiles.length} empty files to process.`);

const PAGE_CONTENT = `
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlaceholderPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is currently under development. Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
`;

const LAYOUT_CONTENT = `
export default function PlaceholderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

const ROUTE_CONTENT = `
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API endpoint coming soon' });
}

export async function POST() {
  return NextResponse.json({ message: 'API endpoint coming soon' });
}
`;

emptyFiles.forEach(file => {
  if (fs.statSync(file).size > 0) {
    console.log(`Skipping non-empty file: ${file}`);
    return;
  }

  let content = '';
  if (file.endsWith('page.tsx')) {
    content = PAGE_CONTENT;
  } else if (file.endsWith('layout.tsx')) {
    content = LAYOUT_CONTENT;
  } else if (file.endsWith('route.ts')) {
    content = ROUTE_CONTENT;
  } else if (file.endsWith('.ts')) {
    content = 'export {}; // Empty placeholder';
  } else if (file.endsWith('.tsx')) {
    content = 'import React from "react"; export default () => null;';
  }

  if (content) {
    fs.writeFileSync(file, content.trim() + '\n');
    console.log(`Populated: ${file}`);
  }
});

console.log('Done!');
