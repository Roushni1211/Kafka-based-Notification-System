import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Inbox,
  Send,
  Radio,
  Building2,
  Users,
  MailCheck,
  User,
  Plus,
  Copy,
  Moon,
  Sun,
  Sparkles,
  HelpCircle,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';

export interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'System';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCompose: () => void;
  onOpenCreateCompany: () => void;
  onOpenJoinCompany: () => void;
  onOpenInvite: () => void;
  onOpenShortcuts: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenCompose,
  onOpenCreateCompany,
  onOpenJoinCompany,
  onOpenInvite,
  onOpenShortcuts,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { isDemoMode, toggleDemoMode } = useAuth();
  const { activeCompany } = useCompany();
  const { showToast } = useToast();

  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const copyJoinCode = () => {
    if (activeCompany?.joinCode) {
      navigator.clipboard.writeText(activeCompany.joinCode);
      showToast(`Copied Space Join Code: ${activeCompany.joinCode}`, 'success');
    } else {
      showToast('No active space selected to copy code.', 'info');
    }
  };

  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-inbox',
      category: 'Navigation',
      title: 'Go to Inbox',
      subtitle: 'View received organization & direct messages',
      icon: Inbox,
      shortcut: ['G', 'I'],
      action: () => onSelectTab('inbox'),
    },
    {
      id: 'nav-channel',
      category: 'Navigation',
      title: 'Go to Live Channel',
      subtitle: activeCompany ? `${activeCompany.name} announcements & broadcasts` : 'Current space channel',
      icon: Radio,
      shortcut: ['G', 'C'],
      action: () => onSelectTab('channel'),
    },
    {
      id: 'nav-sent',
      category: 'Navigation',
      title: 'Go to Sent Messages',
      subtitle: 'Review previously dispatched correspondence',
      icon: Send,
      shortcut: ['G', 'S'],
      action: () => onSelectTab('sent'),
    },
    {
      id: 'nav-companies',
      category: 'Navigation',
      title: 'Go to Company Spaces',
      subtitle: 'Browse and switch organizational workspaces',
      icon: Building2,
      shortcut: ['G', 'A'],
      action: () => onSelectTab('companies'),
    },
    {
      id: 'nav-members',
      category: 'Navigation',
      title: 'Go to Members Directory',
      subtitle: 'View colleagues and leaders in active space',
      icon: Users,
      shortcut: ['G', 'M'],
      action: () => onSelectTab('members'),
    },
    {
      id: 'nav-invitations',
      category: 'Navigation',
      title: 'Go to Pending Invitations',
      subtitle: 'Accept or decline space invites',
      icon: MailCheck,
      action: () => onSelectTab('invitations'),
    },
    {
      id: 'nav-profile',
      category: 'Navigation',
      title: 'Go to My Profile',
      subtitle: 'Manage your name, username, and account',
      icon: User,
      action: () => onSelectTab('profile'),
    },

    // Actions
    {
      id: 'act-compose',
      category: 'Actions',
      title: 'Compose Message / Broadcast',
      subtitle: 'Draft a new announcement or direct message',
      icon: Plus,
      shortcut: ['C'],
      action: onOpenCompose,
    },
    {
      id: 'act-invite',
      category: 'Actions',
      title: 'Invite Colleague to Space',
      subtitle: 'Send an email invite to join your organization',
      icon: UserPlus,
      action: onOpenInvite,
    },
    {
      id: 'act-copy-code',
      category: 'Actions',
      title: 'Copy Space Join Code',
      subtitle: activeCompany ? `Copy ${activeCompany.name} join code (${activeCompany.joinCode})` : 'Copy active space code',
      icon: Copy,
      action: copyJoinCode,
    },
    {
      id: 'act-create-company',
      category: 'Actions',
      title: 'Create New Space',
      subtitle: 'Establish a new company organization space',
      icon: Building2,
      action: onOpenCreateCompany,
    },
    {
      id: 'act-join-company',
      category: 'Actions',
      title: 'Join Space via Code',
      subtitle: 'Enter a 6-character space code to join',
      icon: Building2,
      action: onOpenJoinCompany,
    },

    // System
    {
      id: 'sys-toggle-theme',
      category: 'System',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: `Current appearance: ${isDark ? 'Dark' : 'Light'}`,
      icon: isDark ? Sun : Moon,
      shortcut: ['T'],
      action: toggleTheme,
    },
    {
      id: 'sys-toggle-demo',
      category: 'System',
      title: isDemoMode ? 'Switch to Live Backend Mode' : 'Switch to Demo / Mock Mode',
      subtitle: isDemoMode ? 'Connecting to live workspace server' : 'Simulating workspace with local offline data',
      icon: Sparkles,
      action: toggleDemoMode,
    },
    {
      id: 'sys-shortcuts',
      category: 'System',
      title: 'Keyboard Shortcuts Cheat Sheet',
      subtitle: 'View all keyboard shortcuts and productivity keys',
      icon: HelpCircle,
      shortcut: ['?'],
      action: onOpenShortcuts,
    },
  ];

  // Filter commands by search query
  const filteredCommands = allCommands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation within the list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeCommand = (cmd: CommandItem) => {
    onClose();
    cmd.action();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1e1f20] rounded-2xl shadow-2xl border border-[#dadce0] dark:border-[#3c4043] overflow-hidden flex flex-col max-h-[75vh] animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div className="p-3.5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3 bg-white dark:bg-[#1e1f20]">
          <Search className="w-5 h-5 text-[#1a73e8] dark:text-[#8ab4f8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or jump to..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-sm text-[#202124] dark:text-[#e3e3e3] placeholder-[#5f6368] dark:placeholder-[#9aa0a6] font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6] bg-[#f1f3f4] dark:bg-[#28292a] border border-[#dadce0] dark:border-[#3c4043] rounded-md shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-[#dadce0]/40 dark:divide-[#3c4043]/40">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                      isSelected
                        ? 'bg-[#e8f0fe] dark:bg-[#1c3a63]/50 text-[#1a73e8] dark:text-[#8ab4f8]'
                        : 'text-[#202124] dark:text-[#e3e3e3] hover:bg-[#f1f3f4] dark:hover:bg-[#28292a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#1a73e8] text-white shadow-xs'
                            : 'bg-[#f1f3f4] dark:bg-[#28292a] text-[#5f6368] dark:text-[#9aa0a6]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-medium tracking-tight truncate">
                          {cmd.title}
                        </div>
                        {cmd.subtitle && (
                          <div className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] truncate">
                            {cmd.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {cmd.shortcut ? (
                        <div className="flex items-center gap-1">
                          {cmd.shortcut.map((k) => (
                            <kbd
                              key={k}
                              className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#28292a] border border-[#dadce0] dark:border-[#3c4043] rounded text-[#5f6368] dark:text-[#9aa0a6] shadow-2xs font-semibold"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      ) : (
                        <ArrowRight
                          className={`w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] opacity-0 transition-opacity ${
                            isSelected ? 'opacity-100' : ''
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              No matching commands or actions found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#f8fafd] dark:bg-[#18191a] border-t border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
          <div className="flex items-center gap-2">
            <span>Navigate with <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
            <span>•</span>
            <span>Select with <kbd className="font-mono">↵ Enter</kbd></span>
          </div>
          <span className="hidden sm:inline font-google">Relay Palette</span>
        </div>
      </div>
    </div>
  );
};
