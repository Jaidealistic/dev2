'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function NIOSProgress() {
  const competencies = [
    { code: 'L&S1', title: 'Listening & Speaking', progress: 75 },
    { code: 'R1', title: 'Reading', progress: 60 },
    { code: 'W1', title: 'Writing', progress: 45 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>NIOS Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competencies.map((comp) => (
            <div key={comp.code}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{comp.code}: {comp.title}</span>
                <span className="text-gray-600">{comp.progress}%</span>
              </div>
              <Progress value={comp.progress} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
