import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user previously dismissed
      const dismissed = localStorage.getItem('companyconnect_pwa_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('companyconnect_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 max-w-sm w-[90%] sm:w-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 shadow-google-lg flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-[#1a73e8] dark:text-[#8ab4f8]">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#202124] dark:text-[#e3e3e3]">Install Relay</h4>
          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
            Add to home screen for instant notifications and faster access.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors shadow-google-sm"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="text-[#5f6368] dark:text-[#9aa0a6] hover:bg-gray-100 dark:hover:bg-gray-800 text-xs px-2.5 py-1.5 rounded-full transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#5f6368] hover:text-[#202124] dark:hover:text-white p-1 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
