'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export default function CoOpList() {
  const [coOps, setCoOps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/homeschool/co-op')
      .then((res) => res.json())
      .then((data) => {
        setCoOps(data.coops || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading co-ops...</div>;
  }

  return (
    <div className="space-y-6">
      {coOps.map((coop) => (
        <Card key={coop.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Co-op Image</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{coop.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <span>{coop.location}</span>
                    </div>
                  </div>
                  <Badge variant={coop.isOpen ? 'default' : 'secondary'}>
                    {coop.isOpen ? 'Open for Joining' : 'Full'}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-4">{coop.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>{coop.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    <span>{coop.membersCount} families</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {coop.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2">
                <Button>Join Group</Button>
                <Button variant="outline" className="flex items-center gap-2">
                  View Details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
