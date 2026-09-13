import React, { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, Inbox as InboxIcon, Filter } from 'lucide-react';
import { MessageOverview } from '../types';
import { messageApi } from '../api/messageApi';
import { MOCK_INBOX_MESSAGES } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import { MessageCard } from '../components/messages/MessageCard';

interface InboxPageProps {
  searchQuery: string;
  onOpenMessage: (messageId: string) => void;
  onOpenCompose: () => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({
  searchQuery,
  onOpenMessage,
  onOpenCompose,
}) => {
  const { isDemoMode } = useAuth();
  const { activeCompany } = useCompany();

  const [messages, setMessages] = useState<MessageOverview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [filterCompanyOnly, setFilterCompanyOnly] = useState<boolean>(false);

  const fetchInbox = useCallback(async (isSilent = false) => {
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
      const companyParam = filterCompanyOnly && activeCompany ? activeCompany.id : undefined;
      const res = await messageApi.getInboxMessages(companyParam, 0, 50);
      setMessages(res.content || []);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setMessages(MOCK_INBOX_MESSAGES);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [isDemoMode, activeCompany?.id, filterCompanyOnly]);

  useEffect(() => {
    fetchInbox(false);
  }, [fetchInbox]);

  // Background auto-sync every 30s when active
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        fetchInbox(true);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchInbox]);

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.subject?.toLowerCase().includes(q) ||
      msg.sendername?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#1f1f1f]">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#202124] dark:text-[#e3e3e3]">
            <InboxIcon className="w-5 h-5 text-[#1a73e8] dark:text-[#8ab4f8]" />
            <span>Inbox</span>
          </div>

          {activeCompany && (
            <button
              onClick={() => setFilterCompanyOnly((p) => !p)}
              className={`text-xs px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                filterCompanyOnly
                  ? 'bg-[#e8f0fe] dark:bg-[#1c3a63] text-[#1a73e8] dark:text-[#8ab4f8] border-[#1a73e8]'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Only {activeCompany.name}</span>
            </button>
          )}

          {lastSyncTime && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[10px] text-[#1a73e8] dark:text-[#8ab4f8] font-medium border border-blue-100 dark:border-blue-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Auto-sync ({lastSyncTime})</span>
            </span>
          )}
        </div>

        <button
          onClick={() => fetchInbox(false)}
          className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#1a73e8]' : ''}`} />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span>Checking messages...</span>
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
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">
              {searchQuery ? 'No matching messages' : 'Your inbox is clear'}
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-sm mt-1">
              {searchQuery
                ? 'Try searching with a different keyword or filter.'
                : 'Messages sent to you in your company spaces will appear here.'}
            </p>
            <button
              onClick={onOpenCompose}
              className="mt-4 google-btn-tonal text-xs py-2 px-4"
            >
              Compose a message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
