import React from 'react';
import { Mail, Radio, Building, Users, Bell, Plus } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useCompany } from '../../context/CompanyContext';

interface GoogleBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCompose: () => void;
}

export const GoogleBottomNav: React.FC<GoogleBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCompose,
}) => {
  const { invitations } = useCompany();

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'inbox', label: 'Inbox', icon: Mail },
    { id: 'channel', label: 'Channel', icon: Radio },
    { id: 'companies', label: 'Spaces', icon: Building },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'invitations', label: 'Invites', icon: Bell, badge: invitations.length > 0 ? invitations.length : undefined },
  ];

  return (
    <>
      {/* Mobile Floating Action Button (+ Compose) */}
      <button
        type="button"
        onClick={onOpenCompose}
        className="md:hidden fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom,16px))] z-40 w-14 h-14 rounded-2xl bg-[#c2e7ff] text-[#001d35] shadow-google-md hover:shadow-google-lg active:scale-90 flex items-center justify-center transition-transform touch-manipulation cursor-pointer border border-[#7fcfff]/40"
        title="Compose Message"
        aria-label="Compose Message"
      >
        <Plus className="w-7 h-7 text-[#1a73e8] stroke-[2.5]" />
      </button>

      {/* Material 3 Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f0f4f9] border-t border-[#dadce0] px-1 pt-1.5 flex items-center justify-around select-none shadow-lg"
        style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 12px))' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center py-1 px-2 group flex-1 touch-manipulation cursor-pointer min-h-[48px] active:scale-95 transition-transform"
              aria-label={tab.label}
            >
              {/* Pill active indicator */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#d3e3fd] text-[#041e49]'
                    : 'text-[#444746] group-hover:bg-gray-200/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#041e49] stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#ea4335] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 transition-colors leading-none tracking-tight ${
                  isActive
                    ? 'text-[#041e49] font-bold'
                    : 'text-[#444746] font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
