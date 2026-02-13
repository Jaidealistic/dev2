'use client';

interface NIOSCompetencySelectorProps {
  selected?: string[];
  onChange?: (competencies: string[]) => void;
}

export default function NIOSCompetencySelector({ selected, onChange }: NIOSCompetencySelectorProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">NIOS Competencies</h3>
      <div className="text-sm text-muted-foreground">Select NIOS competencies</div>
    </div>
  );
}
