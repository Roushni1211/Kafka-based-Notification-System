import React from 'react';
import {
  Mail,
  Send,
  Radio,
  Building,
  Users,
  Bell,
  UserCheck,
  Plus,
  Copy,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { ActiveTab, Company } from '../../types';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';

interface GoogleSidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCompose: () => void;
  isCollapsed: boolean;
  onOpenCreateCompany: () => void;
  onOpenJoinCompany: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const GoogleSidebar: React.FC<GoogleSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCompose,
  isCollapsed,
  onOpenCreateCompany,
  onOpenJoinCompany,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { activeCompany, companies, setActiveCompany, invitations } = useCompany();
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState<boolean>(false);
  const [showCompanyMenu, setShowCompanyMenu] = React.useState<boolean>(false);

  const copyJoinCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCompany?.joinCode) return;
    navigator.clipboard.writeText(activeCompany.joinCode);
    setCopied(true);
    showToast(`Join code "${activeCompany.joinCode}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'inbox', label: 'Inbox', icon: Mail },
    { id: 'sent', label: 'Sent Messages', icon: Send },
    { id: 'channel', label: 'Space Channel', icon: Radio },
    { id: 'companies', label: 'Company Spaces', icon: Building, badge: companies.length },
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'invitations', label: 'Invitations', icon: Bell, badge: invitations.length > 0 ? invitations.length : undefined },
    { id: 'profile', label: 'Account Profile', icon: UserCheck },
  ];

  // Reusable sidebar content
  const renderSidebarBody = (mobileMode: boolean) => (
    <>
      {/* Mobile Drawer Header */}
      {mobileMode && (
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#dadce0] bg-[#f8fafd]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] flex items-center justify-center shadow-google-sm">
              <div className="grid grid-cols-2 gap-1 p-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-[#3c4043] leading-tight font-google">
                Re<span className="text-[#1a73e8]">lay</span>
              </span>
              <span className="text-[9px] text-[#5f6368] uppercase font-bold tracking-wider">
                Workspace
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 hover:bg-gray-200/60 rounded-full text-[#5f6368] transition-colors"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Google Compose FAB Button */}
      <div className="p-4">
        <button
          onClick={() => {
            onOpenCompose();
            if (mobileMode && onCloseMobile) onCloseMobile();
          }}
          className={`flex items-center gap-3 bg-[#c2e7ff] hover:bg-[#b3dcf8] text-[#001d35] font-medium py-3.5 px-6 rounded-2xl shadow-google-sm hover:shadow-google-md transition-all duration-200 active:scale-[0.98] w-full ${
            !mobileMode && isCollapsed ? 'justify-center !px-3' : ''
          }`}
          title="Compose new message"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#1a73e8] stroke-[2.5]" />
          </div>
          {(mobileMode || !isCollapsed) && (
            <span className="text-sm font-medium tracking-wide">Compose</span>
          )}
        </button>
      </div>

      {/* Active Space / Company Card */}
      {(mobileMode || !isCollapsed) && (
        <div className="px-4 mb-3">
          <div className="relative">
            <div
              onClick={() => setShowCompanyMenu((p) => !p)}
              className="p-3 rounded-2xl bg-[#f8fafd] border border-[#e8eaed] hover:border-[#1a73e8] cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {activeCompany?.companyDpUrl ? (
                    <img
                      src={activeCompany.companyDpUrl}
                      alt={activeCompany.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1a73e8] font-bold text-xs flex items-center justify-center shrink-0">
                      {activeCompany?.name ? activeCompany.name.substring(0, 2).toUpperCase() : 'SP'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#202124] truncate">
                      {activeCompany?.name || 'Select Space'}
                    </p>
                    <p className="text-[11px] text-[#5f6368] truncate">
                      Code: {activeCompany?.joinCode || 'None'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#5f6368] shrink-0" />
              </div>

              {activeCompany?.joinCode && (
                <button
                  onClick={copyJoinCode}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-[#1a73e8] bg-blue-50/60 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Code Copied!' : 'Copy Join Code'}</span>
                </button>
              )}
            </div>

            {/* Dropdown company switcher */}
            {showCompanyMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white border border-[#dadce0] rounded-2xl shadow-google-lg p-2 max-h-60 overflow-y-auto">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] px-2 py-1">
                  Your Spaces
                </div>
                {companies.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setActiveCompany(comp);
                      setShowCompanyMenu(false);
                    }}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      activeCompany?.id === comp.id
                        ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                        : 'hover:bg-gray-100 text-[#3c4043]'
                    }`}
                  >
                    <span className="truncate">{comp.name}</span>
                    {activeCompany?.id === comp.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}

                <div className="border-t border-[#dadce0] mt-2 pt-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowCompanyMenu(false);
                      onOpenCreateCompany();
                      if (mobileMode && onCloseMobile) onCloseMobile();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#1a73e8] hover:bg-blue-50 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Space</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCompanyMenu(false);
                      onOpenJoinCompany();
                      if (mobileMode && onCloseMobile) onCloseMobile();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#3c4043] hover:bg-gray-100 rounded-xl"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Join with Code</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (mobileMode && onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-4 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#d3e3fd] text-[#041e49] font-semibold'
                  : 'text-[#444746] hover:bg-[#f1f3f4]'
              } ${!mobileMode && isCollapsed ? 'justify-center !px-0' : ''}`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#041e49]' : ''}`} />
              {(mobileMode || !isCollapsed) && (
                <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#041e49] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#dadce0] transition-all duration-300 select-none z-20 shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* 2. Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200 backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* 3. Mobile Slide-Over Navigation Drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white flex flex-col border-r border-[#dadce0] shadow-2xl transition-transform duration-300 transform select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {renderSidebarBody(true)}
      </aside>
    </>
  );
};
