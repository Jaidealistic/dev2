'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Shield, MoreHorizontal, UserCheck, UserX, GraduationCap, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load users:', error);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchStr = `${user.email} ${user.firstName} ${user.lastName} ${user.role}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-3 h-3 mr-1" />;
      case 'LEARNER': return <GraduationCap className="w-3 h-3 mr-1" />;
      case 'EDUCATOR': return <Users className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'LEARNER': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'EDUCATOR': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading user data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-[#f0ede8] shadow-sm">
        <h2 className="text-lg font-semibold text-[#2d2d2d]">{t('admin.platformUsers')}</h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
          <Input
            placeholder={t('admin.searchUsers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-[#e8e5e0] focus-visible:ring-[#7a9b7e] rounded-xl bg-[#faf9f7]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#f0ede8] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.firstName || user.lastName
                          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                          : 'No Name'}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getRoleColor(user.role)}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="flex items-center text-emerald-600 text-xs font-medium">
                        <UserCheck className="w-3 h-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 text-xs font-medium">
                        <UserX className="w-3 h-3 mr-1" /> Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
