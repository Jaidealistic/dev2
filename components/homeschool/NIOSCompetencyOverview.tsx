'use client';

interface NIOSCompetencyOverviewProps {
  userId?: string;
}

export default function NIOSCompetencyOverview({ userId }: NIOSCompetencyOverviewProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">NIOS Competency Overview</h3>
      <div className="text-sm text-muted-foreground">Loading competencies...</div>
    </div>
  );
}
