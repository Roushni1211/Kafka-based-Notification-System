import React, { useState, useEffect } from 'react';
import {
  X,
  Reply,
  Download,
  Calendar,
  User,
  Paperclip,
  Building,
  Maximize2
} from 'lucide-react';
import { DetailedMessage } from '../../types';
import { messageApi } from '../../api/messageApi';
import { MOCK_DETAILED_MESSAGES } from '../../api/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageDetailModalProps {
  messageId: string | null;
  onClose: () => void;
  onReply: (subject: string) => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  messageId,
  onClose,
  onReply,
}) => {
  const { isDemoMode } = useAuth();
  const { activeCompany } = useCompany();

  const [message, setMessage] = useState<DetailedMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!messageId) return;
    setIsLoading(true);

    if (isDemoMode) {
      const found =
        MOCK_DETAILED_MESSAGES[messageId] || {
          id: messageId,
          senderName: 'Team Member',
          subject: 'Sample Space Announcement',
          content: 'This is the detailed body content of the broadcast message.',
          sentAt: new Date().toISOString(),
        };
      setMessage(found);
      setIsLoading(false);
      return;
    }

    if (activeCompany) {
      messageApi
        .getMessage(activeCompany.id, messageId)
        .then((data) => {
          setMessage(data);
        })
        .catch(() => {
          // Fallback
          setMessage(MOCK_DETAILED_MESSAGES[messageId] || null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [messageId, isDemoMode, activeCompany]);

  if (!messageId) return null;

  const initials = message?.senderName
    ? message.senderName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'M';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-modal-pop">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            <span>{activeCompany?.name || 'Company Space'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            <span>Loading message details...</span>
          </div>
        ) : message ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Subject */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-[#e3e3e3] leading-snug">
              {message.subject}
            </h2>

            {/* Sender and Time */}
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#f8fafd] dark:bg-[#28292a] border border-[#e8eaed] dark:border-[#3c4043]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#202124] dark:text-[#e3e3e3] truncate">
                    {message.senderName}
                  </h4>
                  <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Space Member</span>
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-[#5f6368] dark:text-[#9aa0a6] shrink-0 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(message.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>

            {/* Message Body with Rich Markdown & Code Syntax Highlighting */}
            <div className="py-2">
              <MarkdownRenderer
                content={message.content}
                className="text-sm sm:text-base text-[#202124] dark:text-[#e3e3e3]"
              />
            </div>

            {/* Attachment preview / download if exists */}
            {message.attachmentUrl && (
              <div className="mt-4 pt-4 border-t border-[#dadce0] dark:border-[#3c4043]">
                <span className="text-xs font-semibold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider block mb-2">
                  Attached File
                </span>

                <div className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                  {message.attachmentType?.startsWith('image/') || message.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <div className="relative group">
                      <img
                        src={message.attachmentUrl}
                        alt="Attachment"
                        className="max-h-80 w-full object-cover rounded-t-2xl"
                      />
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full shadow-google-sm flex items-center gap-1.5 text-[#1a73e8] dark:text-[#8ab4f8]"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Full Image</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#1a73e8]">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#202124] dark:text-[#e3e3e3]">Document Attachment</p>
                          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Secure enterprise storage</p>
                        </div>
                      </div>
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="google-btn-tonal text-xs py-1.5 px-4"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-sm">Message could not be loaded.</div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between bg-white dark:bg-[#1e1f20]">
          <button
            onClick={() => {
              if (message) {
                onReply(`Re: ${message.subject}`);
                onClose();
              }
            }}
            className="google-btn-primary py-2 px-5 text-sm"
          >
            <Reply className="w-4 h-4" />
            <span>Reply to Message</span>
          </button>

          <button
            onClick={onClose}
            className="google-btn-outlined py-2 px-5 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
