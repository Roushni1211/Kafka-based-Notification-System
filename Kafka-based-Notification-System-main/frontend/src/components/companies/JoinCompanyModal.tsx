import React, { useState } from 'react';
import { X, KeyRound, ArrowRight } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';

interface JoinCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCompanyModal: React.FC<JoinCompanyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { joinCompany } = useCompany();
  const { showToast } = useToast();

  const [code, setCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please enter the space invitation code', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await joinCompany(code.trim());
    setIsSubmitting(false);

    if (success) {
      setCode('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-pop">
        <div className="p-5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/40 text-[#34a853] dark:text-[#81c995] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">Join with Code</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Enter code provided by the space administrator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Space Join Code
            </label>
            <input
              type="text"
              placeholder="e.g. DEEPMIND-8942"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="google-input text-sm font-mono tracking-wider text-center text-base"
            />
            <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mt-1.5 text-center">
              Codes are case-insensitive letters and numbers separated by a hyphen.
            </p>
          </div>

          <div className="pt-3 border-t border-[#dadce0] dark:border-[#3c4043] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="google-btn-outlined py-2 px-4 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="google-btn-primary py-2 px-5 text-xs"
            >
              <span>{isSubmitting ? 'Joining...' : 'Join Space'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
