'use client';

interface UpcomingCoOpSessionsProps {
  userId: string;
}

export default function UpcomingCoOpSessions({ userId }: UpcomingCoOpSessionsProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">Upcoming Co-Op Sessions</h3>
      <div className="text-sm text-muted-foreground">No sessions scheduled</div>
    </div>
  );
}
