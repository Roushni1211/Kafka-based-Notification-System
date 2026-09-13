import React, { useState, useEffect, useCallback } from 'react';
import { Radio, Plus, RefreshCw, Copy, Check, Users, Shield } from 'lucide-react';
import { MessageOverview } from '../types';
import { messageApi } from '../api/messageApi';
import { MOCK_INBOX_MESSAGES } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import { MessageCard } from '../components/messages/MessageCard';
import { useToast } from '../context/ToastContext';

interface CompanyChannelPageProps {
  searchQuery: string;
  onOpenMessage: (messageId: string) => void;
  onOpenCompose: () => void;
  onOpenInvite: () => void;
}

export const CompanyChannelPage: React.FC<CompanyChannelPageProps> = ({
  searchQuery,
  onOpenMessage,
  onOpenCompose,
  onOpenInvite,
}) => {
  const { isDemoMode } = useAuth();
  const { activeCompany, members } = useCompany();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<MessageOverview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const fetchChannel = useCallback(async (isSilent = false) => {
    if (!activeCompany) {
      setIsLoading(false);
      return;
    }

    if (!isSilent) setIsLoading(true);
    setIsSyncing(true);

    if (isDemoMode) {
      setMessages(MOCK_INBOX_MESSAGES);
      setIsLoading(false);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      return;
    }

    try {
      const res = await messageApi.getCompanyMessages(activeCompany.id, 0, 50);
      setMessages(res.content || []);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setMessages(MOCK_INBOX_MESSAGES);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [activeCompany?.id, isDemoMode]);

  useEffect(() => {
    fetchChannel(false);
  }, [fetchChannel]);

  // Background auto-sync every 30s when window tab is active
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        fetchChannel(true);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchChannel]);

  const copyJoinCode = () => {
    if (!activeCompany?.joinCode) return;
    navigator.clipboard.writeText(activeCompany.joinCode);
    setCopied(true);
    showToast('Space Join Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.subject?.toLowerCase().includes(q) ||
      msg.sendername?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#1f1f1f]">
      {/* Space Hero Banner */}
      {activeCompany && (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-[#1a2333] dark:via-[#1e1f20] dark:to-[#1f1f1f] border-b border-[#dadce0] dark:border-[#3c4043] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {activeCompany.companyDpUrl ? (
                <img
                  src={activeCompany.companyDpUrl}
                  alt={activeCompany.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-black/5 dark:border-white/10"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#1a73e8] text-white font-bold text-xl flex items-center justify-center shadow-google-sm">
                  {activeCompany.name.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-[#202124] dark:text-[#e3e3e3]">
                    {activeCompany.name}
                  </h1>
                  <span className="flex items-center gap-1 text-[11px] bg-green-100 dark:bg-green-950/40 text-[#137333] dark:text-[#81c995] font-semibold px-2 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Live Channel</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{members.length} Space Members</span>
                  </span>

                  <button
                    onClick={copyJoinCode}
                    className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] flex items-center gap-1 font-mono transition-colors font-semibold"
                  >
                    <span>Code: {activeCompany.joinCode}</span>
                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenInvite}
                className="google-btn-outlined py-2 px-3.5 text-xs"
              >
                <span>Invite Colleague</span>
              </button>

              <button
                onClick={onOpenCompose}
                className="google-btn-primary py-2 px-4 text-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Post Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Header Bar */}
      <div className="px-4 py-2.5 bg-[#f8fafd] dark:bg-[#131314] border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between text-xs text-[#5f6368] dark:text-[#9aa0a6]">
        <div className="flex items-center gap-2">
          <span>Recent Channel Broadcasts & Announcements</span>
          {lastSyncTime && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[10px] text-[#1a73e8] dark:text-[#8ab4f8] font-medium border border-blue-100 dark:border-blue-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Live sync ({lastSyncTime})</span>
            </span>
          )}
        </div>
        <button
          onClick={() => fetchChannel(false)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          title="Refresh Channel"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#1a73e8]' : ''}`} />
        </button>
      </div>

      {/* Channel Feed List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span>Streaming space broadcasts...</span>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div>
            {filteredMessages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                onClick={() => onOpenMessage(msg.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/30 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center mb-3">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">
              No broadcasts posted yet
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-sm mt-1">
              Be the first to share an announcement with all members of this space.
            </p>
            <button
              onClick={onOpenCompose}
              className="mt-4 google-btn-primary text-xs py-2 px-4"
            >
              Post Announcement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
