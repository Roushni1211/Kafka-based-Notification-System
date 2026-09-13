import React from 'react';
import { Star, Paperclip, ChevronRight } from 'lucide-react';
import { MessageOverview, DetailedMessage } from '../../types';

interface MessageCardProps {
  message: MessageOverview | DetailedMessage;
  onClick: () => void;
  isRead?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onClick,
  isRead = true,
}) => {
  const senderName = 'sendername' in message ? message.sendername : message.senderName;
  const content = 'content' in message ? message.content : '';
  const hasAttachment = 'attachmentUrl' in message && !!message.attachmentUrl;

  const initials = senderName
    ? senderName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'M';

  // Format date nicely
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group px-4 py-3 sm:py-3.5 border-b border-[#f1f3f4] dark:border-[#28292a] hover:bg-[#f2f6fc] dark:hover:bg-[#28292a] cursor-pointer transition-all duration-150 active:scale-[0.997] flex items-center gap-3 sm:gap-4 select-none ${
        !isRead
          ? 'bg-white dark:bg-[#1a1b1e] font-semibold'
          : 'bg-transparent text-[#444746] dark:text-[#c4c7c5]'
      }`}
    >
      {/* Star / Checkbox on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="hidden sm:block text-gray-300 dark:text-gray-600 hover:text-amber-400 p-1 rounded-full transition-colors"
      >
        <Star className="w-4 h-4" />
      </button>

      {/* Sender Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-medium text-xs flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110">
        {initials}
      </div>

      {/* Message Summary */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-3">
        {/* Sender Name */}
        <span className="text-sm text-[#202124] dark:text-[#e3e3e3] font-medium sm:w-44 shrink-0 truncate">
          {senderName}
        </span>

        {/* Subject & Preview */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-[#202124] dark:text-[#e3e3e3] font-medium truncate">
            {message.subject}
          </span>
          {content && (
            <span className="text-[#5f6368] dark:text-[#9aa0a6] truncate hidden md:inline">
              — {content}
            </span>
          )}
        </div>
      </div>

      {/* Attachment indicator & Date */}
      <div className="flex items-center gap-2 shrink-0 text-xs text-[#5f6368] dark:text-[#9aa0a6]">
        {hasAttachment && (
          <div className="p-1 text-gray-400 dark:text-gray-500 hover:text-[#1a73e8]">
            <Paperclip className="w-4 h-4" />
          </div>
        )}
        <span className="text-[11px] sm:text-xs">{formatDate(message.sentAt)}</span>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
