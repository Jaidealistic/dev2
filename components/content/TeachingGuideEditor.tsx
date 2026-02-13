'use client';

interface TeachingGuideEditorProps {
  teachingGuide?: any;
  onChange?: (teachingGuide: any) => void;
}

export default function TeachingGuideEditor({ teachingGuide, onChange }: TeachingGuideEditorProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">Teaching Guide</h3>
      <div className="text-sm text-muted-foreground">Teaching guide editor component</div>
    </div>
  );
}
