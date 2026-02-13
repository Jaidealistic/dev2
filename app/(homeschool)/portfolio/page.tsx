import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PortfolioList from '@/components/homeschool/PortfolioList';

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-600">Showcase student work and achievements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <PortfolioList />
    </div>
  );
}
