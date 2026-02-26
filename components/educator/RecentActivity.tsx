'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function RecentActivity({ educatorId }: { educatorId: string }) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/educator/activity')
      .then((res) => res.json())
      .then((data) => setActivities(data.activities || []))
      .catch(() => { });
  }, [educatorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
              <Clock className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-slate-400">No recent activity detected</p>
          </div>
        ) : (
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:w-0.5 before:-translate-x-px before:bg-slate-100">
            {activities.map((activity, i) => (
              <div key={i} className="relative flex items-start gap-4 pl-8 group">
                <div className="absolute left-0 mt-1.5 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 shadow-sm transition-transform group-hover:scale-125 group-hover:bg-emerald-600" />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                      {activity.description}
                    </p>
                    <time className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {activity.time}
                    </time>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Automated activity log entry for verification.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
