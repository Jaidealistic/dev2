import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DailySchedule from '@/components/homeschool/DailySchedule';
import NIOSProgress from '@/components/homeschool/NIOSProgress';
import QuickLinks from '@/components/homeschool/QuickLinks';

export default async function HomeschoolHub() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Homeschool Hub</h1>
        <p className="text-gray-600">Your teaching command center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DailySchedule />
          <QuickLinks />
        </div>
        
        <div>
          <NIOSProgress />
        </div>
      </div>
    </div>
  );
}