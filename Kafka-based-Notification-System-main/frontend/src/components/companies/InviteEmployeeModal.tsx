import React, { useState } from 'react';
import { X, UserPlus, Mail, Send } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeCompany, inviteEmployee } = useCompany();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) {
      showToast('Please select a space first', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter an employee email address', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await inviteEmployee(activeCompany.id, email.trim());
    setIsSubmitting(false);

    if (success) {
      setEmail('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-pop">
        <div className="p-5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">Invite Space Member</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] truncate">
                To: {activeCompany?.name || 'Active Space'}
              </p>
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
              Employee Email Address
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="colleague@company.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="google-input google-input-with-icon text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mt-1.5">
              An invitation notification will be dispatched to the colleague.
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
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Invite...' : 'Send Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
