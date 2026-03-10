'use client';

/**
 * COLLABORATION LOBBY
 *
 * Lists active collaboration rooms with create/join functionality.
 * Connects to the collaboration service via Socket.IO.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, Hash, ArrowLeft, Search, Lock, Globe } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  topic: string;
  participants: number;
  maxParticipants: number;
  isPrivate: boolean;
  language: string;
  createdBy: string;
}

const SAMPLE_ROOMS: Room[] = [
  { id: 'room-1', name: 'English Beginners', topic: 'Greetings & Introductions', participants: 4, maxParticipants: 8, isPrivate: false, language: 'English', createdBy: 'System' },
  { id: 'room-2', name: 'Tamil Practice', topic: 'Daily Conversations', participants: 2, maxParticipants: 6, isPrivate: false, language: 'Tamil', createdBy: 'System' },
  { id: 'room-3', name: 'Pronunciation Club', topic: 'Difficult Sounds', participants: 5, maxParticipants: 10, isPrivate: false, language: 'English', createdBy: 'System' },
  { id: 'room-4', name: 'Study Group A', topic: 'Grammar Review', participants: 3, maxParticipants: 5, isPrivate: true, language: 'English', createdBy: 'Educator' },
];

export default function CollaborationLobby() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', topic: '', maxParticipants: 8, isPrivate: false });

  const filtered = SAMPLE_ROOMS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.topic.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newRoom.name.trim()) return;
    const id = `room-${Date.now()}`;
    router.push(`/collaboration/room?id=${id}&name=${encodeURIComponent(newRoom.name)}`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/learner/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Collaboration Rooms</h1>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Room
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Create room form */}
        {showCreate && (
          <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 mb-6">
            <h2 className="text-base font-semibold text-[#2d2d2d] mb-4">Create New Room</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text" value={newRoom.name} onChange={(e) => setNewRoom(p => ({ ...p, name: e.target.value }))}
                placeholder="Room name" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm focus:ring-2 focus:ring-[#7a9b7e] outline-none"
              />
              <input
                type="text" value={newRoom.topic} onChange={(e) => setNewRoom(p => ({ ...p, topic: e.target.value }))}
                placeholder="Topic (optional)" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm focus:ring-2 focus:ring-[#7a9b7e] outline-none"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                <input type="checkbox" checked={newRoom.isPrivate} onChange={(e) => setNewRoom(p => ({ ...p, isPrivate: e.target.checked }))} className="rounded" />
                Private room
              </label>
            </div>
            <button onClick={handleCreate} disabled={!newRoom.name.trim()} className="px-5 py-2.5 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f] disabled:opacity-40 transition-colors">
              Create & Join
            </button>
          </div>
        )}

        {/* Join by code */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-white text-sm focus:ring-2 focus:ring-[#7a9b7e] outline-none"
            />
          </div>
          <input
            type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Join code" className="w-32 px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-white text-sm font-mono focus:ring-2 focus:ring-[#7a9b7e] outline-none"
          />
          <button disabled={!joinCode.trim()} onClick={() => router.push(`/collaboration/room?id=${joinCode}`)}
            className="px-4 py-2.5 bg-[#f0ede8] text-[#2d2d2d] text-sm font-medium rounded-xl hover:bg-[#e8e5e0] disabled:opacity-40 transition-colors">
            Join
          </button>
        </div>

        {/* Room list */}
        <div className="space-y-3">
          {filtered.map(room => (
            <button
              key={room.id}
              onClick={() => router.push(`/collaboration/room?id=${room.id}&name=${encodeURIComponent(room.name)}`)}
              className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#e8e5e0] hover:border-[#7a9b7e] hover:shadow-sm transition-all text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-[#f0f4f0] flex items-center justify-center shrink-0">
                {room.isPrivate ? <Lock className="w-5 h-5 text-[#8a8a8a]" /> : <Hash className="w-5 h-5 text-[#7a9b7e]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2d2d2d] text-sm">{room.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#f0ede8] text-[#6b6b6b] rounded-full">{room.language}</span>
                </div>
                <p className="text-xs text-[#8a8a8a] mt-0.5 truncate">{room.topic}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#8a8a8a] shrink-0">
                <Users className="w-3.5 h-3.5" />
                <span>{room.participants}/{room.maxParticipants}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
