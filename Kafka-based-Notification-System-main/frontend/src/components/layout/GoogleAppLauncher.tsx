import React, { useRef, useEffect } from 'react';
import { Mail, MessageSquare, Building, Users, Bell, Shield, Radio, Sparkles } from 'lucide-react';
import { ActiveTab } from '../../types';

interface GoogleAppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCompose: () => void;
}

export const GoogleAppLauncher: React.FC<GoogleAppLauncherProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenCompose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const apps = [
    {
      name: 'Mail Inbox',
      icon: Mail,
      color: 'text-[#ea4335]',
      bg: 'bg-red-50 dark:bg-red-950/40',
      action: () => { onSelectTab('inbox'); onClose(); }
    },
    {
      name: 'Channel',
      icon: Radio,
      color: 'text-[#1a73e8]',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      action: () => { onSelectTab('channel'); onClose(); }
    },
    {
      name: 'Spaces',
      icon: Building,
      color: 'text-[#34a853]',
      bg: 'bg-green-50 dark:bg-green-950/40',
      action: () => { onSelectTab('companies'); onClose(); }
    },
    {
      name: 'Teams',
      icon: Users,
      color: 'text-[#fbbc04]',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      action: () => { onSelectTab('members'); onClose(); }
    },
    {
      name: 'Invites',
      icon: Bell,
      color: 'text-[#ea4335]',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      action: () => { onSelectTab('invitations'); onClose(); }
    },
    {
      name: 'Compose',
      icon: Sparkles,
      color: 'text-[#1a73e8]',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      action: () => { onOpenCompose(); onClose(); }
    },
    {
      name: 'Sent Mails',
      icon: MessageSquare,
      color: 'text-[#5f6368] dark:text-[#9aa0a6]',
      bg: 'bg-gray-100 dark:bg-gray-800',
      action: () => { onSelectTab('sent'); onClose(); }
    },
    {
      name: 'Security',
      icon: Shield,
      color: 'text-[#34a853]',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      action: () => { onSelectTab('profile'); onClose(); }
    }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-14 right-14 sm:right-16 z-50 w-72 sm:w-80 bg-white dark:bg-[#1e1f20] rounded-3xl p-4 shadow-google-lg border border-[#dadce0] dark:border-[#3c4043] animate-dropdown-pop"
    >
      <div className="grid grid-cols-3 gap-2">
        {apps.map((app, index) => {
          const Icon = app.icon;
          return (
            <button
              key={index}
              onClick={app.action}
              className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] transition-colors group text-center"
            >
              <div className={`w-11 h-11 rounded-2xl ${app.bg} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105`}>
                <Icon className={`w-5 h-5 ${app.color}`} />
              </div>
              <span className="text-xs font-normal text-[#3c4043] dark:text-[#bdc1c6] group-hover:text-[#202124] dark:group-hover:text-white line-clamp-1">
                {app.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
