'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function NIOSTracker({ competencies }: { competencies: any[] }) {
  const levelColors: Record<string, string> = {
    NOT_STARTED: 'gray',
    EMERGING: 'yellow',
    DEVELOPING: 'blue',
    PROFICIENT: 'green',
    MASTERED: 'purple',
  };

  const levelProgress: Record<string, number> = {
    NOT_STARTED: 0,
    EMERGING: 25,
    DEVELOPING: 50,
    PROFICIENT: 75,
    MASTERED: 100,
  };

  if (competencies.length === 0) {
    return <p className="text-gray-500 text-sm">No competencies tracked yet</p>;
  }

  return (
    <div className="space-y-4">
      {competencies.map((comp) => (
        <div key={comp.id}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{comp.competencyCode}</span>
            <Badge variant="outline">{comp.masteryLevel}</Badge>
          </div>
          <Progress value={levelProgress[comp.masteryLevel]} />
          <p className="text-xs text-gray-600 mt-1">{comp.description}</p>
        </div>
      ))}
    </div>
  );
}
