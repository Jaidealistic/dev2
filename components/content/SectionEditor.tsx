'use client';

interface SectionEditorProps {
  sections?: any[];
  onChange?: (sections: any) => void;
}

export default function SectionEditor({ sections, onChange }: SectionEditorProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">Sections</h3>
      <div className="text-sm text-muted-foreground">Section editor component</div>
    </div>
  );
}
