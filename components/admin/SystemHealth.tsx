'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Server, Clock, HardDrive, RefreshCcw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Button } from '@/components/ui/button';

interface HealthData {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  services: {
    postgresql: { status: 'up' | 'down'; displayName: string };
    mongodb: { status: 'up' | 'down'; displayName: string };
    server: {
      status: 'up' | 'down';
      displayName: string;
      uptime: number;
      memory: { heapUsed: number; heapTotal: number; rss: number };
    };
  };
  latency: string;
}

export default function SystemHealth() {
  const { t } = useLanguage();
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/system/health');
      const healthData = await res.json();
      setData(healthData);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(() => fetchHealth(), 30000); // 30s polling
    return () => clearInterval(interval);
  }, [fetchHealth]);

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border border-[#f0ede8] animate-pulse" />
        ))}
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  };

  const StatusIcon = ({ status }: { status: 'up' | 'down' | 'healthy' | 'degraded' | 'error' }) => {
    if (status === 'up' || status === 'healthy') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    if (status === 'degraded') return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-rose-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#7a9b7e]" />
          <h2 className="text-lg font-semibold text-[#2d2d2d]">{t('admin.systemHealth')}</h2>
          {data && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${data.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
              {t(`admin.${data.status}`)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8a8a8a]">
            {t('admin.lastUpdated')}: {data ? new Date(data.timestamp).toLocaleTimeString() : '--:--'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHealth(true)}
            disabled={refreshing}
            className="h-8 rounded-lg border-[#e8e5e0] text-[#6b6b6b] hover:bg-[#faf9f7]"
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('admin.refreshing') : t('common.tryAgain')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Databases Card */}
        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#faf9f7] border-b border-[#f0ede8] py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#2d2d2d]">
              <Database className="h-4 w-4" />
              {t('admin.databaseStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">PostgreSQL</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#2d2d2d] uppercase">{data?.services.postgresql.status === 'up' ? t('admin.healthy') : t('admin.down')}</span>
                <StatusIcon status={data?.services.postgresql.status || 'down'} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b6b6b]">MongoDB</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#2d2d2d] uppercase">{data?.services.mongodb.status === 'up' ? t('admin.healthy') : t('admin.down')}</span>
                <StatusIcon status={data?.services.mongodb.status || 'down'} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Status Card */}
        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#faf9f7] border-b border-[#f0ede8] py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#2d2d2d]">
              <Server className="h-4 w-4" />
              {t('admin.serverStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#8a8a8a]" />
                <span className="text-sm text-[#6b6b6b]">{t('admin.uptime')}</span>
              </div>
              <span className="text-sm font-medium text-[#2d2d2d]">{data ? formatUptime(data.services.server.uptime) : '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#8a8a8a]" />
                <span className="text-sm text-[#6b6b6b]">Latency</span>
              </div>
              <span className="text-sm font-medium text-[#2d2d2d]">{data?.latency || '--'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Resources Card */}
        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#faf9f7] border-b border-[#f0ede8] py-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#2d2d2d]">
              <HardDrive className="h-4 w-4" />
              {t('admin.memoryUsage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8a8a8a]">Heap Usage</span>
                <span className="text-[#2d2d2d] font-medium">{data?.services.server.memory.heapUsed}MB / {data?.services.server.memory.heapTotal}MB</span>
              </div>
              <div className="w-full h-1.5 bg-[#f0ede8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7a9b7e] transition-all duration-500"
                  style={{ width: `${data ? (data.services.server.memory.heapUsed / data.services.server.memory.heapTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6b6b6b]">Resident Set Size</span>
              <span className="text-sm font-medium text-[#2d2d2d]">{data?.services.server.memory.rss}MB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
