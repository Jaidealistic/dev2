'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon, Video, Mic, Download } from 'lucide-react';

export default function PortfolioList({ childId }: { childId?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/homeschool/portfolio';
    if (childId) {
      url += `?childId=${childId}`;
    }
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [childId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Mic;
      default: return FileText;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading portfolio...</div>;
  }

  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-8">No portfolio items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = getIcon(item.type);
        return (
          <Card key={item.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex gap-2 mb-4">
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.childName}</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
