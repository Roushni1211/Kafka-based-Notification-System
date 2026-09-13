import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutSection {
  title: string;
  items: {
    description: string;
    keys: string[];
  }[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const sections: ShortcutSection[] = [
    {
      title: 'Global Navigation',
      items: [
        { description: 'Go to Inbox', keys: ['G', 'I'] },
        { description: 'Go to Live Channel', keys: ['G', 'C'] },
        { description: 'Go to Sent Messages', keys: ['G', 'S'] },
        { description: 'Go to Space Members', keys: ['G', 'M'] },
        { description: 'Open Command Palette', keys: ['Ctrl', 'K'] },
      ],
    },
    {
      title: 'Workspace Actions',
      items: [
        { description: 'Compose new message / broadcast', keys: ['C'] },
        { description: 'Focus search bar', keys: ['/'] },
        { description: 'Toggle Dark / Light theme', keys: ['T'] },
        { description: 'Show keyboard shortcuts', keys: ['?'] },
        { description: 'Dismiss active dialog or drawer', keys: ['Esc'] },
      ],
    },
    {
      title: 'Compose & Formatting',
      items: [
        { description: 'Bold text', keys: ['**text**'] },
        { description: 'Italic text', keys: ['*text*'] },
        { description: 'Inline code', keys: ['`code`'] },
        { description: 'Fenced code block', keys: ['```code```'] },
        { description: 'Bullet list item', keys: ['- item'] },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1e1f20] rounded-3xl shadow-2xl border border-[#dadce0] dark:border-[#3c4043] overflow-hidden flex flex-col max-h-[85vh] animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f0fe] dark:bg-[#1c3a63] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#202124] dark:text-[#f1f3f4] font-google">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                Productivity shortcuts for Relay Workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a73e8] dark:text-[#8ab4f8]">
                {sec.title}
              </h3>
              <div className="space-y-2">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100 dark:border-gray-800/60"
                  >
                    <span className="text-[#3c4043] dark:text-[#e3e3e3] pr-2">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-1 text-[11px] font-mono bg-[#f1f3f4] dark:bg-[#28292a] border border-[#dadce0] dark:border-[#3c4043] rounded-md text-[#202124] dark:text-[#e3e3e3] shadow-2xs font-semibold"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8fafd] dark:bg-[#18191a] border-t border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between text-xs text-[#5f6368] dark:text-[#9aa0a6]">
          <span>Press <kbd className="font-mono font-bold">Esc</kbd> anytime to dismiss dialogs</span>
          <button
            onClick={onClose}
            className="google-btn-primary text-xs py-1.5 px-4"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
