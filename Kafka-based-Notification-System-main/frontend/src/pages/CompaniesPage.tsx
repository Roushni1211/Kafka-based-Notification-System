import React, { useState } from 'react';
import { Building, Plus, KeyRound, Copy, Check, Shield, CheckCircle } from 'lucide-react';
import { Company } from '../types';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface CompaniesPageProps {
  onOpenCreate: () => void;
  onOpenJoin: () => void;
  onNavigateChannel: () => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({
  onOpenCreate,
  onOpenJoin,
  onNavigateChannel,
}) => {
  const { companies, activeCompany, setActiveCompany } = useCompany();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (company: Company) => {
    navigator.clipboard.writeText(company.joinCode);
    setCopiedId(company.id);
    showToast(`Code "${company.joinCode}" copied!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-[#1f1f1f] p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <h1 className="text-2xl font-bold text-[#202124] dark:text-[#e3e3e3] font-google">
            Company Spaces Directory
          </h1>
          <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
            Manage your organizations, switch active broadcast channels, and invite teams
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenJoin}
            className="google-btn-outlined py-2 px-4 text-xs font-medium"
          >
            <KeyRound className="w-4 h-4" />
            <span>Join via Code</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="google-btn-primary py-2 px-4 text-xs font-medium"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Space</span>
          </button>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="py-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] mb-4">
          Available Spaces ({companies.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const isActive = activeCompany?.id === company.id;
            const isOwner = user?.id === company.ownerId;

            return (
              <div
                key={company.id}
                className={`p-5 rounded-3xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-google-md active:scale-[0.99] flex flex-col justify-between select-none ${
                  isActive
                    ? 'border-[#1a73e8] dark:border-[#8ab4f8] bg-[#f8fafd] dark:bg-[#1c2c44] shadow-google-sm ring-1 ring-[#1a73e8] dark:ring-[#8ab4f8]'
                    : 'border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] hover:border-gray-400 dark:hover:border-gray-600 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {company.companyDpUrl ? (
                        <img
                          src={company.companyDpUrl}
                          alt={company.name}
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-[#202124] dark:text-[#e3e3e3] truncate">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isOwner ? (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5" />
                              <span>Owner</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium px-2 py-0.5 rounded-full">
                              Member
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] font-bold px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join code section */}
                  <div className="mt-4 p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#5f6368] dark:text-[#9aa0a6] block uppercase tracking-wider">
                        Join Code
                      </span>
                      <span className="font-mono font-semibold text-[#202124] dark:text-[#e3e3e3]">
                        {company.joinCode}
                      </span>
                    </div>

                    <button
                      onClick={() => copyCode(company)}
                      className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-[#1a73e8] dark:text-[#8ab4f8]"
                      title="Copy code"
                    >
                      {copiedId === company.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveCompany(company);
                      onNavigateChannel();
                    }}
                    className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium"
                  >
                    Open Live Channel →
                  </button>

                  {!isActive && (
                    <button
                      onClick={() => setActiveCompany(company)}
                      className="google-btn-tonal text-xs py-1.5 px-3.5"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
