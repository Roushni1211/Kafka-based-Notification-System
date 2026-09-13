import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, Trash2, Mail } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';

interface MembersPageProps {
  onOpenInvite: () => void;
}

export const MembersPage: React.FC<MembersPageProps> = ({ onOpenInvite }) => {
  const { activeCompany, members, removeEmployee } = useCompany();
  const { user } = useAuth();
  const [search, setSearch] = useState<string>('');

  const isOwner = user?.id === activeCompany?.ownerId;

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#1f1f1f] p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#202124] dark:text-[#e3e3e3] font-google">
              Space Members & Team
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8]">
              {members.length}
            </span>
          </div>
          <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
            Active Space: <span className="font-semibold text-[#202124] dark:text-white">{activeCompany?.name || 'No Space Selected'}</span>
          </p>
        </div>

        <button
          onClick={onOpenInvite}
          className="google-btn-primary py-2.5 px-5 text-xs font-medium self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="py-4">
        <div className="relative max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="google-input google-input-with-icon text-xs py-2.5"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Members List */}
      <div className="border border-[#dadce0] dark:border-[#3c4043] rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-[#f1f3f4] dark:divide-[#28292a]">
          {filteredMembers.map((member) => {
            const isMe = member.id === user?.id;
            const initials = member.name
              ? member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : 'U';

            return (
              <div
                key={member.id}
                className="p-4 sm:px-6 hover:bg-[#f8fafd] dark:hover:bg-[#28292a] flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#202124] dark:text-[#e3e3e3] truncate">
                        {member.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] font-bold px-2 py-0.2 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{member.username}</span>
                    </p>
                  </div>
                </div>

                {/* Role / Owner Badge or Remove */}
                <div className="flex items-center gap-2 shrink-0">
                  {member.id === activeCompany?.ownerId ? (
                    <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Space Leader</span>
                    </span>
                  ) : isOwner && !isMe ? (
                    <button
                      onClick={() => activeCompany && removeEmployee(activeCompany.id, member.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                      title="Remove employee from space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">
              No space members match your search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
