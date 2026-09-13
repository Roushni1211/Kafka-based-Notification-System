import React, { useRef, useEffect } from 'react';
import { LogOut, UserCheck, Sparkles, Building2, ExternalLink, Compass, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';

interface GoogleProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileTab: () => void;
  onOpenLanding?: () => void;
  onOpen404?: () => void;
}

export const GoogleProfileMenu: React.FC<GoogleProfileMenuProps> = ({
  isOpen,
  onClose,
  onOpenProfileTab,
  onOpenLanding,
  onOpen404,
}) => {
  const { user, isDemoMode, toggleDemoMode, logout } = useAuth();
  const { activeCompany } = useCompany();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div
      ref={cardRef}
      className="absolute top-14 right-2 sm:right-4 z-50 w-80 sm:w-88 bg-white dark:bg-[#1e1f20] rounded-3xl p-5 shadow-google-lg border border-[#dadce0] dark:border-[#3c4043] animate-dropdown-pop"
    >
      {/* Account Header */}
      <div className="text-center pb-4 border-b border-[#f1f3f4] dark:border-[#28292a]">
        <div className="relative inline-block mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#4285F4] text-white flex items-center justify-center text-xl font-semibold shadow-google-sm mx-auto">
            {initials}
          </div>
          {isDemoMode && (
            <span className="absolute -bottom-1 -right-1 bg-[#fbbc04] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#1e1f20]">
              DEMO
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">{user?.name || 'User'}</h3>
        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">{user?.username || 'user@example.com'}</p>

        <button
          onClick={() => { onOpenProfileTab(); onClose(); }}
          className="mt-3 inline-flex items-center gap-1.5 border border-[#dadce0] dark:border-[#3c4043] hover:bg-[#f8fafd] dark:hover:bg-[#28292a] text-[#1a73e8] dark:text-[#8ab4f8] text-xs font-medium px-4 py-1.5 rounded-full transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Manage your Account</span>
        </button>
      </div>

      {/* Active Space Info */}
      <div className="my-3 px-1">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f8fafd] dark:bg-[#131314] border border-[#e8eaed] dark:border-[#28292a]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#202124] dark:text-[#e3e3e3] truncate">
                {activeCompany?.name || 'No Space Selected'}
              </p>
              <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] truncate">
                Code: {activeCompany?.joinCode || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="mt-2 pt-2 border-t border-[#f1f3f4] dark:border-[#28292a] space-y-1">
        <button
          onClick={() => { toggleDemoMode(); onClose(); }}
          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] text-xs text-[#3c4043] dark:text-[#bdc1c6] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fbbc04]" />
            <span>{isDemoMode ? 'Switch to Live Backend' : 'Switch to Demo Mode'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            Toggle
          </span>
        </button>

        {onOpenLanding && (
          <button
            onClick={() => { onOpenLanding(); onClose(); }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] text-xs text-[#3c4043] dark:text-[#bdc1c6] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8]" />
              <span>Product Overview</span>
            </div>
            <span className="text-[10px] text-gray-400">Landing</span>
          </button>
        )}

        {onOpen404 && (
          <button
            onClick={() => { onOpen404(); onClose(); }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f3f4] dark:hover:bg-[#28292a] text-xs text-[#3c4043] dark:text-[#bdc1c6] transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#ea4335] dark:text-[#f28b82]" />
              <span>404 Error Preview</span>
            </div>
            <span className="text-[10px] text-gray-400">Page</span>
          </button>
        )}

        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-[#fce8e6] dark:hover:bg-[#371514] text-xs text-[#c5221f] dark:text-[#f28b82] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out of all accounts</span>
        </button>
      </div>
    </div>
  );
};
