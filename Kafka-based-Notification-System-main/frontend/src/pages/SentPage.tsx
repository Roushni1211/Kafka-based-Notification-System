import React, { useState, useEffect, useCallback } from 'react';
import { Send, RefreshCw, Paperclip, ChevronRight } from 'lucide-react';
import { DetailedMessage } from '../types';
import { messageApi } from '../api/messageApi';
import { MOCK_SENT_MESSAGES } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';

interface SentPageProps {
  searchQuery: string;
  onOpenMessage: (messageId: string) => void;
  onOpenCompose: () => void;
}

export const SentPage: React.FC<SentPageProps> = ({
  searchQuery,
  onOpenMessage,
  onOpenCompose,
}) => {
  const { isDemoMode } = useAuth();
  const { activeCompany } = useCompany();

  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchSent = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsSyncing(true);

    if (isDemoMode) {
      setMessages(MOCK_SENT_MESSAGES);
      setIsLoading(false);
      setIsSyncing(false);
      return;
    }

    try {
      const res = await messageApi.getSentMessages(activeCompany?.id, 0, 50);
      setMessages(res.content || []);
    } catch {
      setMessages(MOCK_SENT_MESSAGES);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [isDemoMode, activeCompany?.id]);

  useEffect(() => {
    fetchSent(false);
  }, [fetchSent]);

  // Auto-sync every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        fetchSent(true);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchSent]);

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.subject?.toLowerCase().includes(q) ||
      msg.content?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#1f1f1f]">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#202124] dark:text-[#e3e3e3]">
          <Send className="w-5 h-5 text-[#1a73e8] dark:text-[#8ab4f8]" />
          <span>Sent Messages</span>
        </div>

        <button
          onClick={() => fetchSent(false)}
          className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title="Refresh sent messages"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#1a73e8]' : ''}`} />
        </button>
      </div>

      {/* Sent Message List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span>Loading sent history...</span>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div>
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onOpenMessage(msg.id)}
                className="px-4 py-3 sm:py-3.5 border-b border-[#f1f3f4] dark:border-[#28292a] hover:bg-[#f2f6fc] dark:hover:bg-[#28292a] cursor-pointer transition-all flex items-center gap-3 sm:gap-4 select-none group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] font-medium text-xs flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#202124] dark:text-[#e3e3e3] truncate">
                      {msg.subject}
                    </span>
                    <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] shrink-0">
                      {new Date(msg.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate mt-0.5">
                    {msg.content}
                  </p>
                </div>

                {msg.attachmentUrl && (
                  <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/30 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center mb-3">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">
              No sent messages yet
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-sm mt-1">
              Any broadcasts or messages you dispatch will be tracked here.
            </p>
            <button
              onClick={onOpenCompose}
              className="mt-4 google-btn-primary text-xs py-2 px-4"
            >
              Send your first message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
