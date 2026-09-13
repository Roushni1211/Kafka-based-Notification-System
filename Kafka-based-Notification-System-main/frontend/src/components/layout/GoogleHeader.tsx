import React, { useState } from 'react';
import { Menu, Search, Grid, Sparkles, X, Keyboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAppLauncher } from './GoogleAppLauncher';
import { GoogleProfileMenu } from './GoogleProfileMenu';
import { ActiveTab } from '../../types';

interface GoogleHeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCompose: () => void;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
  onOpenLanding?: () => void;
  onOpen404?: () => void;
}

export const GoogleHeader: React.FC<GoogleHeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSelectTab,
  onOpenCompose,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenLanding,
  onOpen404,
}) => {
  const { user, isDemoMode, toggleDemoMode } = useAuth();

  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-white dark:bg-[#1f1f1f] border-b border-[#dadce0] dark:border-[#3c4043] px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title="Main menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onSelectTab('inbox')}>
          {/* Google Workspace Styled Logo */}
          <div className="flex items-center gap-1.5">
            <div className="relative w-8 h-8 rounded-xl bg-[#e8f0fe] dark:bg-[#1c3a63] flex items-center justify-center shadow-google-sm">
              {/* Google 4 colors dots */}
              <div className="grid grid-cols-2 gap-1 p-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-medium tracking-tight text-[#3c4043] leading-none font-google whitespace-nowrap">
                Re<span className="text-[#1a73e8]">lay</span>
              </span>
              <span className="text-[10px] text-[#5f6368] tracking-wider uppercase font-semibold hidden sm:block">
                Enterprise Workspace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search pill with Ctrl+K trigger */}
      <div className="flex-1 max-w-2xl hidden md:block">
        <div className="google-search-pill">
          <Search className="w-5 h-5 text-[#5f6368] dark:text-[#9aa0a6] shrink-0" />
          <input
            type="text"
            placeholder="Search mail, spaces, broadcasts, and people..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-[#202124] dark:text-[#e3e3e3] placeholder-[#5f6368] dark:placeholder-[#9aa0a6]"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-[#5f6368] dark:text-[#9aa0a6]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f1f3f4] dark:bg-[#28292a] text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6] border border-[#dadce0] dark:border-[#3c4043] hover:text-[#1a73e8] transition-colors"
              title="Open Command Palette (Ctrl+K)"
            >
              <span>Ctrl</span>
              <span>K</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Shortcuts, Theme, Launcher & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile Search / Command Palette Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title="Search or jump to (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex p-2 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-5 h-5" />
        </button>
        {/* Demo / Live Indicator Pill */}
        <button
          onClick={() => toggleDemoMode()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isDemoMode
              ? 'bg-[#fef7e0] text-[#b06000] border border-[#fbbc04] dark:bg-[#332a00] dark:text-[#fdd663]'
              : 'bg-[#e6f4ea] text-[#137333] border border-[#34a853] dark:bg-[#0d2818] dark:text-[#81c995]'
          }`}
          title="Click to toggle Live Backend / Demo Mode"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDemoMode ? 'Demo Mode' : 'Live API'}</span>
        </button>

        {/* App Launcher ("Waffle") */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLauncherOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="p-2.5 hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] rounded-full text-[#5f6368] dark:text-[#9aa0a6] transition-colors"
            title="Workspace apps"
          >
            <Grid className="w-5 h-5" />
          </button>
          <GoogleAppLauncher
            isOpen={isLauncherOpen}
            onClose={() => setIsLauncherOpen(false)}
            onSelectTab={onSelectTab}
            onOpenCompose={onOpenCompose}
          />
        </div>

        {/* Profile Circle */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsLauncherOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-[#1a73e8] hover:opacity-90 text-white font-medium flex items-center justify-center text-sm shadow-google-sm transition-opacity ml-1 border-2 border-transparent focus:border-[#4285F4]"
            title={`Workspace Account: ${user?.name || ''}`}
          >
            {initials}
          </button>
          <GoogleProfileMenu
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onOpenProfileTab={() => onSelectTab('profile')}
            onOpenLanding={onOpenLanding}
            onOpen404={onOpen404}
          />
        </div>
      </div>
    </header>
  );
};
