import React, { useState } from 'react';
import { UserCheck, Mail, Shield, Save, Server, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUserName, isDemoMode, logout } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    await updateUserName(name.trim());
    setIsSaving(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#1f1f1f] p-4 sm:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#dadce0] dark:border-[#3c4043]">
        <h1 className="text-2xl font-bold text-[#202124] dark:text-[#e3e3e3] font-google">
          Workspace Account & Preferences
        </h1>
        <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
          Manage your personal details, workspace security, and display settings
        </p>
      </div>

      <div className="max-w-2xl py-6 space-y-6">
        {/* Profile Identity Card */}
        <div className="p-6 rounded-3xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#1e1f20] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#4285F4] text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="text-lg font-bold text-[#202124] dark:text-[#e3e3e3] truncate">
              {user?.name || 'Workspace User'}
            </h2>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate mt-0.5">
              {user?.username || 'user@company.corp'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-[11px] bg-green-100 dark:bg-green-950/40 text-[#137333] dark:text-[#81c995] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Account</span>
              </span>
              <span className="text-[11px] bg-blue-100 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Verified Session</span>
              </span>
            </div>
          </div>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSave} className="p-6 rounded-3xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#202124] dark:text-[#e3e3e3] uppercase tracking-wider">
            Personal Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="google-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Email Address (Cannot be modified)
            </label>
            <input
              type="email"
              value={user?.username || ''}
              disabled
              className="google-input text-sm opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || name === user?.name}
              className="google-btn-primary py-2 px-5 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Display & Appearance */}

        {/* Workspace Health & Security */}
        <div className="p-6 rounded-3xl border border-[#dadce0] dark:border-[#3c4043] bg-gray-50 dark:bg-[#181819] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
            <Server className="w-4 h-4" />
            <span>Workspace Health & Security</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#202122] border border-gray-200 dark:border-gray-800">
              <span className="block font-bold text-[#1a73e8]">Live Engine</span>
              <span className="text-[10px] text-gray-500">Sub-15ms Latency</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#202122] border border-gray-200 dark:border-gray-800">
              <span className="block font-bold text-[#34a853]">Encrypted</span>
              <span className="text-[10px] text-gray-500">256-Bit SSL</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#202122] border border-gray-200 dark:border-gray-800">
              <span className="block font-bold text-[#ea4335]">Availability</span>
              <span className="text-[10px] text-gray-500">99.99% Uptime</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-[#202122] border border-gray-200 dark:border-gray-800">
              <span className="block font-bold text-[#fbbc04]">Cloud Storage</span>
              <span className="text-[10px] text-gray-500">Secure Vault</span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3 px-4 rounded-full border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-[#c5221f] dark:text-[#f28b82] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out of Relay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
