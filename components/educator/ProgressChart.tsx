'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data }: { data: any[] }) {
  const chartData = data
    .filter((d) => d.score !== null)
    .map((d) => ({
      date: new Date(d.createdAt).toLocaleDateString(),
      score: d.score,
    }))
    .reverse()
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
