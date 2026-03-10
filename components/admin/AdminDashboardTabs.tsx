'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function AdminDashboardTabs() {
    const { t } = useLanguage();

    return (
        <TabsList className="grid w-full grid-cols-4 bg-white p-1.5 rounded-xl border border-[#f0ede8] shadow-sm mb-6 h-auto">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#e8f0e9] data-[state=active]:text-[#5a8c5c] rounded-lg py-2.5 text-sm font-medium transition-colors">
                {t('admin.analytics')}
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#e8f0e9] data-[state=active]:text-[#5a8c5c] rounded-lg py-2.5 text-sm font-medium transition-colors">
                {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-[#e8f0e9] data-[state=active]:text-[#5a8c5c] rounded-lg py-2.5 text-sm font-medium transition-colors">
                {t('admin.content')}
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-[#e8f0e9] data-[state=active]:text-[#5a8c5c] rounded-lg py-2.5 text-sm font-medium transition-colors">
                {t('admin.system')}
            </TabsTrigger>
        </TabsList>
    );
}
