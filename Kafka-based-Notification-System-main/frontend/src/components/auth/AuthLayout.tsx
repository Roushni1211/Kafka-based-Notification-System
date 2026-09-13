import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  onNavigateLanding?: () => void;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  icon,
  isLoading = false,
  onNavigateLanding,
  children,
  footerActions,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#f8fafd] dark:bg-[#131314] text-[#202124] dark:text-[#e3e3e3] font-google selection:bg-blue-100 dark:selection:bg-blue-900/40 transition-colors">
      {/* Top minimal bar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between h-10 px-2">
        {onNavigateLanding ? (
          <button
            type="button"
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Product Overview</span>
          </button>
        ) : (
          <div />
        )}
      </header>

      {/* Main Card Container */}
      <main className="flex-1 flex items-center justify-center my-4">
        <div className="w-full max-w-[460px] sm:max-w-[480px] bg-white dark:bg-[#1e1f20] rounded-[28px] p-7 sm:p-10 shadow-google-lg border border-[#dadce0] dark:border-[#3c4043] animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
          {/* Animated Google Progress Bar when loading */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8f0fe] dark:bg-[#1c3a63] overflow-hidden z-20">
              <div className="h-full bg-gradient-to-r from-[#1a73e8] via-[#ea4335] to-[#34a853] animate-google-progress w-full" />
            </div>
          )}

          {/* Header Branding */}
          <div className="text-center mb-7">
            {icon ? (
              <div className="mb-4 inline-flex items-center justify-center">{icon}</div>
            ) : (
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-[#e8f0fe] dark:bg-[#1c3a63] mb-4 shadow-google-sm">
                <div className="grid grid-cols-2 gap-1.5 p-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                </div>
              </div>
            )}

            <h1 className="text-2xl font-normal tracking-tight text-[#202124] dark:text-[#e3e3e3]">
              {title}
            </h1>
            <div className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1.5 leading-normal">
              {subtitle}
            </div>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer Actions / Switchers inside card */}
          {footerActions && (
            <div className="mt-6 pt-6 border-t border-[#f1f3f4] dark:border-[#28292a] text-center">
              {footerActions}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
