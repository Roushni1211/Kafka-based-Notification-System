import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-top-2">
      {!isOnline ? (
        <div className="flex items-center gap-2 bg-[#fef7e0] dark:bg-[#332a00] border border-[#f9ab00] text-[#b06000] dark:text-[#fdd663] text-xs font-medium px-3 py-1.5 rounded-full shadow-google-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Working offline</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-[#e6f4ea] dark:bg-[#0d2818] border border-[#34a853] text-[#137333] dark:text-[#81c995] text-xs font-medium px-3 py-1.5 rounded-full shadow-google-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Back online</span>
        </div>
      )}
    </div>
  );
};
