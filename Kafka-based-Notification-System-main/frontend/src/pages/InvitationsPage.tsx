import React from 'react';
import { Bell, Check, Building, ArrowRight } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

interface InvitationsPageProps {
  onNavigateSpaces: () => void;
}

export const InvitationsPage: React.FC<InvitationsPageProps> = ({ onNavigateSpaces }) => {
  const { invitations, acceptInvitation, isLoading } = useCompany();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#1f1f1f] p-4 sm:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#202124] dark:text-[#e3e3e3] font-google">
            Pending Space Invitations
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-[#c5221f] dark:text-[#f28b82]">
            {invitations.length}
          </span>
        </div>
        <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
          Review and accept organization invitations sent to your corporate account
        </p>
      </div>

      {/* Invitations List */}
      <div className="py-6">
        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-3xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#1e1f20] flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {inv.companyDpUrl ? (
                    <img
                      src={inv.companyDpUrl}
                      alt={inv.name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                      {inv.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#202124] dark:text-[#e3e3e3] truncate">
                      {inv.name}
                    </h4>
                    <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                      Invited you to join their Workspace Space
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => acceptInvitation(inv.id)}
                  disabled={isLoading}
                  className="google-btn-primary py-2 px-4 text-xs shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Invite</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mb-3">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">
              No pending invitations
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-sm mt-1">
              When an organization or company space invites your email, it will appear here.
            </p>
            <button
              onClick={onNavigateSpaces}
              className="mt-4 google-btn-tonal text-xs py-2 px-4"
            >
              <span>Explore My Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
