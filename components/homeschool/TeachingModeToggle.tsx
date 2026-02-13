'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, User } from 'lucide-react';

export default function TeachingModeToggle() {
  const [mode, setMode] = useState<'parent' | 'teacher'>('teacher');

  const toggleMode = () => {
    setMode(mode === 'parent' ? 'teacher' : 'parent');
    // Store preference in localStorage
    localStorage.setItem('homeschool-mode', mode === 'parent' ? 'teacher' : 'parent');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">View Mode:</span>
      <Button
        variant={mode === 'teacher' ? 'default' : 'outline'}
        size="sm"
        onClick={toggleMode}
        aria-pressed={mode === 'teacher'}
        aria-label={`Switch to ${mode === 'teacher' ? 'parent' : 'teaching'} mode`}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Teaching Mode
      </Button>
      <Button
        variant={mode === 'parent' ? 'default' : 'outline'}
        size="sm"
        onClick={toggleMode}
        aria-pressed={mode === 'parent'}
        aria-label={`Switch to ${mode === 'parent' ? 'teaching' : 'parent'} mode`}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" aria-hidden="true" />
        Parent View
      </Button>
    </div>
  );
}