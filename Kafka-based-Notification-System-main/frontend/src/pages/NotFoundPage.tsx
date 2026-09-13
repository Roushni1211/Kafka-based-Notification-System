import React from 'react';
import { Home, ArrowLeft, Inbox, Building2, Compass, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateLogin?: () => void;
  onNavigateInbox?: () => void;
  onNavigateSpaces?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
  onNavigateInbox,
  onNavigateSpaces,
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#131314] text-[#202124] dark:text-[#e3e3e3] flex flex-col font-google selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* Top minimal header */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-transparent dark:border-[#28292a]">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] dark:bg-[#1c3a63] flex items-center justify-center shadow-google-sm transition-transform group-hover:scale-105">
            <div className="grid grid-cols-2 gap-0.5 p-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#3c4043] dark:text-[#e3e3e3]">
            Re<span className="text-[#1a73e8] dark:text-[#8ab4f8]">lay</span>
          </span>
        </button>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#28292a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto text-left w-full">
        {/* Visual Illustration */}
        <div className="w-full flex items-center justify-center mb-8">
          <div className="relative">
            {/* Soft backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-red-400/20 to-amber-400/20 rounded-full blur-2xl transform scale-125 pointer-events-none" />
            
            {/* Modern Geometric 404 Mascot / Badge */}
            <div className="relative flex items-center gap-3 p-4 rounded-3xl bg-[#f8fafd] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-google-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1a73e8] to-[#1557b0] flex flex-col items-center justify-center text-white shadow-md">
                <span className="text-2xl sm:text-3xl font-black tracking-tight">404</span>
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-80">Error</span>
              </div>
              <div className="pr-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ea4335] dark:text-[#f28b82]">
                  <AlertCircle className="w-4 h-4" />
                  <span>Resource Not Located</span>
                </div>
                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5 max-w-xs">
                  The requested endpoint, workspace view, or space channel does not exist.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Signature Style Copy */}
        <div className="w-full space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#e3e3e3] tracking-tight">
            404. <span className="text-[#5f6368] dark:text-[#9aa0a6] font-normal">That’s an error.</span>
          </h1>

          <p className="text-base text-[#3c4043] dark:text-[#bdc1c6] leading-relaxed">
            The requested URL was not found on this server. <span className="text-[#5f6368] dark:text-[#9aa0a6]">That’s all we know.</span>
          </p>

          <hr className="border-[#dadce0] dark:border-[#3c4043] my-6" />

          {/* Helpful Navigation Suggestions */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
              Where would you like to go?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] hover:shadow-google-sm text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#202124] dark:text-[#e3e3e3]">Product Overview</p>
                  <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">Return to public landing page</p>
                </div>
              </button>

              {onNavigateInbox ? (
                <button
                  onClick={onNavigateInbox}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] hover:border-[#34a853] dark:hover:border-[#81c995] hover:shadow-google-sm text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/40 text-[#34a853] dark:text-[#81c995] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202124] dark:text-[#e3e3e3]">Workspace Inbox</p>
                    <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">View received enterprise messages</p>
                  </div>
                </button>
              ) : onNavigateLogin ? (
                <button
                  onClick={onNavigateLogin}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] hover:shadow-google-sm text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202124] dark:text-[#e3e3e3]">Sign In to Workspace</p>
                    <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">Access your corporate account</p>
                  </div>
                </button>
              ) : null}

              {onNavigateSpaces && (
                <button
                  onClick={onNavigateSpaces}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#1e1f20] hover:border-[#fbbc04] dark:hover:border-[#fdd663] hover:shadow-google-sm text-left transition-all group sm:col-span-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#fbbc04] dark:text-[#fdd663] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202124] dark:text-[#e3e3e3]">Spaces & Channels</p>
                    <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">Browse affiliated company channels and teams</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 sm:px-12 border-t border-[#dadce0] dark:border-[#3c4043] text-xs text-[#5f6368] dark:text-[#9aa0a6] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 Relay Enterprise Workspace.</span>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateHome} className="hover:underline">
            Home
          </button>
          <span>•</span>
          <span className="text-gray-400 dark:text-gray-600">Status: All Systems Operational</span>
        </div>
      </footer>
    </div>
  );
};
