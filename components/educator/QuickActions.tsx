'use client';

export default function QuickActions() {
  return (
    <div className="flex gap-4">
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Create Lesson
      </button>
      <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
        View Messages
      </button>
    </div>
  );
}
