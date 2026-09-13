import React, { useState, useRef } from 'react';
import { X, Building, Upload, Image as ImageIcon } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useToast } from '../../context/ToastContext';
import { compressImage } from '../../utils/imageCompressor';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createCompany } = useCompany();
  const { showToast } = useToast();

  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      try {
        const compressed = await compressImage(f, 800, 800, 0.82);
        setFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch {
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a space / company name', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await createCompany(name.trim(), file);
    setIsSubmitting(false);

    if (success) {
      setName('');
      setFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-pop">
        <div className="p-5 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e3e3e3]">Create Company Space</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Establish a dedicated workspace channel</p>
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
              Space / Organization Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cloud Architecture Lab"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="google-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Space Logo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] rounded-2xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Logo Preview"
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                  <span className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] mt-1 block">Change image</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                    Click or drag & drop space logo (PNG, JPG)
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
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
              {isSubmitting ? 'Creating Space...' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
