import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { GoogleHeader } from './components/layout/GoogleHeader';
import { GoogleSidebar } from './components/layout/GoogleSidebar';
import { GoogleBottomNav } from './components/layout/GoogleBottomNav';
import { GoogleComposeModal } from './components/messages/GoogleComposeModal';
import { MessageDetailModal } from './components/messages/MessageDetailModal';
import { CreateCompanyModal } from './components/companies/CreateCompanyModal';
import { JoinCompanyModal } from './components/companies/JoinCompanyModal';
import { InviteEmployeeModal } from './components/companies/InviteEmployeeModal';
import { CommandPaletteModal } from './components/layout/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { InboxPage } from './pages/InboxPage';
import { SentPage } from './pages/SentPage';
import { CompanyChannelPage } from './pages/CompanyChannelPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { MembersPage } from './pages/MembersPage';
import { InvitationsPage } from './pages/InvitationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ActiveTab } from './types';

type AuthView = 'landing' | 'login' | 'register' | 'verify-otp' | 'forgot' | '404';

const getInitialAuthView = (): AuthView => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/404')) return '404';
  if (path.includes('/register')) return 'register';
  if (path.includes('/login')) return 'login';
  return 'landing';
};

const getInitialActiveTab = (): ActiveTab => {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('sent')) return 'sent';
  if (hash.includes('channel')) return 'channel';
  if (hash.includes('companies')) return 'companies';
  if (hash.includes('members')) return 'members';
  if (hash.includes('invitations')) return 'invitations';
  if (hash.includes('profile')) return 'profile';
  return 'inbox';
};

const getInitialMessageId = (): string | null => {
  const hash = window.location.hash;
  const match = hash.match(/message\/([^/]+)/);
  return match ? match[1] : null;
};

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Auth flow states
  const [authView, setAuthView] = useState<AuthView>(getInitialAuthView);
  const [verifyEmail, setVerifyEmail] = useState<string>('');
  const [viewOverride, setViewOverride] = useState<'landing' | '404' | null>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/404')) return '404';
    return null;
  });

  // Workspace navigation states with URL hash sync
  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialActiveTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeRecipientId, setComposeRecipientId] = useState<string | undefined>(undefined);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(getInitialMessageId);

  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState<boolean>(false);
  const [isJoinCompanyOpen, setIsJoinCompanyOpen] = useState<boolean>(false);
  const [isInviteEmployeeOpen, setIsInviteEmployeeOpen] = useState<boolean>(false);

  // Pro-Grade Power User Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Synchronize activeTab with URL hash
  const handleSelectTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedMessageId(null);
    setIsMobileDrawerOpen(false);
    window.location.hash = `#/${tab}`;
  }, []);

  const handleOpenMessage = useCallback((id: string) => {
    setSelectedMessageId(id);
    window.location.hash = `#/message/${id}`;
  }, []);

  const handleCloseMessage = useCallback(() => {
    setSelectedMessageId(null);
    window.location.hash = `#/${activeTab}`;
  }, [activeTab]);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const msgMatch = window.location.hash.match(/message\/([^/]+)/);
      if (msgMatch) {
        setSelectedMessageId(msgMatch[1]);
        return;
      }
      setSelectedMessageId(null);
      if (hash.includes('sent')) setActiveTab('sent');
      else if (hash.includes('channel')) setActiveTab('channel');
      else if (hash.includes('companies')) setActiveTab('companies');
      else if (hash.includes('members')) setActiveTab('members');
      else if (hash.includes('invitations')) setActiveTab('invitations');
      else if (hash.includes('profile')) setActiveTab('profile');
      else if (hash.includes('inbox')) setActiveTab('inbox');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K, c, ?, Esc, g sequence)
  useEffect(() => {
    let gSequenceTimeout: ReturnType<typeof setTimeout> | null = null;
    let gPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Ctrl+K / Cmd+K Command Palette (always accessible)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape closes open overlays
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        setIsComposeOpen(false);
        setIsCreateCompanyOpen(false);
        setIsJoinCompanyOpen(false);
        setIsInviteEmployeeOpen(false);
        setSelectedMessageId(null);
        setIsMobileDrawerOpen(false);
        return;
      }

      // Do not trigger single-key hotkeys when typing in input
      if (isEditing) return;

      // '?' opens shortcuts cheat sheet
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }

      // 'c' opens compose
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setComposeSubject('');
        setComposeRecipientId(undefined);
        setIsComposeOpen(true);
        return;
      }

      // 'g' key chord navigation (e.g. g then i -> inbox)
      if (e.key.toLowerCase() === 'g') {
        gPressed = true;
        if (gSequenceTimeout) clearTimeout(gSequenceTimeout);
        gSequenceTimeout = setTimeout(() => {
          gPressed = false;
        }, 1000);
        return;
      }

      if (gPressed) {
        gPressed = false;
        if (gSequenceTimeout) clearTimeout(gSequenceTimeout);
        const k = e.key.toLowerCase();
        if (k === 'i') {
          e.preventDefault();
          handleSelectTab('inbox');
        } else if (k === 'c') {
          e.preventDefault();
          handleSelectTab('channel');
        } else if (k === 's') {
          e.preventDefault();
          handleSelectTab('sent');
        } else if (k === 'a') {
          e.preventDefault();
          handleSelectTab('companies');
        } else if (k === 'm') {
          e.preventDefault();
          handleSelectTab('members');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gSequenceTimeout) clearTimeout(gSequenceTimeout);
    };
  }, [handleSelectTab]);

  // Loading spinner on initial startup
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#131314]">
        <div className="w-12 h-12 rounded-full border-4 border-[#1a73e8] border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-medium text-[#5f6368] dark:text-[#9aa0a6] font-google">
          Initializing Relay Workspace...
        </span>
      </div>
    );
  }

  // Active view override when authenticated
  if (viewOverride === 'landing') {
    return (
      <LandingPage
        onNavigateLogin={() => setViewOverride(null)}
        onNavigateRegister={() => setViewOverride(null)}
        onNavigate404={() => setViewOverride('404')}
      />
    );
  }

  if (viewOverride === '404') {
    return (
      <NotFoundPage
        onNavigateHome={() => setViewOverride('landing')}
        onNavigateInbox={() => setViewOverride(null)}
        onNavigateSpaces={() => {
          setViewOverride(null);
          handleSelectTab('companies');
        }}
      />
    );
  }

  // If not authenticated, render auth views
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateRegister={() => setAuthView('register')}
          onNavigate404={() => setAuthView('404')}
        />
      );
    }
    if (authView === '404') {
      return (
        <NotFoundPage
          onNavigateHome={() => setAuthView('landing')}
          onNavigateLogin={() => setAuthView('login')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateLanding={() => setAuthView('landing')}
          onRegisteredSuccess={(email) => {
            setVerifyEmail(email);
            setAuthView('verify-otp');
          }}
        />
      );
    }
    if (authView === 'verify-otp') {
      return (
        <VerifyOtpPage
          email={verifyEmail}
          onVerifiedSuccess={() => setAuthView('login')}
          onNavigateLogin={() => setAuthView('login')}
          onNavigateLanding={() => setAuthView('landing')}
        />
      );
    }
    if (authView === 'forgot') {
      return (
        <ForgotPasswordPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <LoginPage
        onNavigateRegister={() => setAuthView('register')}
        onNavigateForgot={() => setAuthView('forgot')}
        onNavigateLanding={() => setAuthView('landing')}
      />
    );
  }

  // Open compose with custom subject and recipient
  const handleOpenReply = (subject: string, recipientId?: string) => {
    setComposeSubject(subject);
    setComposeRecipientId(recipientId);
    setIsComposeOpen(true);
  };

  return (
    <CompanyProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#131314] text-[#202124] dark:text-[#e3e3e3] overflow-hidden">
        {/* Offline Status Badge */}
        <OfflineIndicator />

        {/* PWA Install Prompt Banner */}
        <PWAInstallBanner />

        {/* Google Workspace Header */}
        <GoogleHeader
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setIsMobileDrawerOpen((p) => !p);
            } else {
              setIsSidebarCollapsed((p) => !p);
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={handleSelectTab}
          onOpenCompose={() => {
            setComposeSubject('');
            setComposeRecipientId(undefined);
            setIsComposeOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenLanding={() => setViewOverride('landing')}
          onOpen404={() => setViewOverride('404')}
        />

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Sidebar (Desktop Persistent + Mobile Slide-Over Drawer) */}
          <GoogleSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onOpenCompose={() => {
              setComposeSubject('');
              setComposeRecipientId(undefined);
              setIsComposeOpen(true);
            }}
            isCollapsed={isSidebarCollapsed}
            onOpenCreateCompany={() => setIsCreateCompanyOpen(true)}
            onOpenJoinCompany={() => setIsJoinCompanyOpen(true)}
            isMobileOpen={isMobileDrawerOpen}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />

          {/* Active Workspace View */}
          <main key={activeTab} className="flex-1 flex flex-col overflow-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom,16px))] md:pb-0 animate-tab-fade">
            {activeTab === 'inbox' && (
              <InboxPage
                searchQuery={searchQuery}
                onOpenMessage={handleOpenMessage}
                onOpenCompose={() => setIsComposeOpen(true)}
              />
            )}
            {activeTab === 'sent' && (
              <SentPage
                searchQuery={searchQuery}
                onOpenMessage={handleOpenMessage}
                onOpenCompose={() => setIsComposeOpen(true)}
              />
            )}
            {activeTab === 'channel' && (
              <CompanyChannelPage
                searchQuery={searchQuery}
                onOpenMessage={handleOpenMessage}
                onOpenCompose={() => setIsComposeOpen(true)}
                onOpenInvite={() => setIsInviteEmployeeOpen(true)}
              />
            )}
            {activeTab === 'companies' && (
              <CompaniesPage
                onOpenCreate={() => setIsCreateCompanyOpen(true)}
                onOpenJoin={() => setIsJoinCompanyOpen(true)}
                onNavigateChannel={() => handleSelectTab('channel')}
              />
            )}
            {activeTab === 'members' && (
              <MembersPage onOpenInvite={() => setIsInviteEmployeeOpen(true)} />
            )}
            {activeTab === 'invitations' && (
              <InvitationsPage onNavigateSpaces={() => handleSelectTab('companies')} />
            )}
            {activeTab === 'profile' && <ProfilePage />}
          </main>
        </div>

        {/* Mobile Material 3 Bottom Navigation Bar */}
        <GoogleBottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenCompose={() => {
            setComposeSubject('');
            setComposeRecipientId(undefined);
            setIsComposeOpen(true);
          }}
        />

        {/* Interactive Global Command Palette (Ctrl+K) */}
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={handleSelectTab}
          onOpenCompose={() => {
            setComposeSubject('');
            setComposeRecipientId(undefined);
            setIsComposeOpen(true);
          }}
          onOpenCreateCompany={() => setIsCreateCompanyOpen(true)}
          onOpenJoinCompany={() => setIsJoinCompanyOpen(true)}
          onOpenInvite={() => setIsInviteEmployeeOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Keyboard Shortcuts Cheat Sheet Modal (?) */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />

        {/* Floating Google Compose Modal */}
        <GoogleComposeModal
          isOpen={isComposeOpen}
          onClose={() => {
            setIsComposeOpen(false);
            setComposeSubject('');
            setComposeRecipientId(undefined);
          }}
          defaultSubject={composeSubject}
          defaultRecipientId={composeRecipientId}
        />

        {/* Detailed Message Modal */}
        <MessageDetailModal
          messageId={selectedMessageId}
          onClose={handleCloseMessage}
          onReply={(subject) => handleOpenReply(subject)}
        />

        {/* Company / Space Action Modals */}
        <CreateCompanyModal
          isOpen={isCreateCompanyOpen}
          onClose={() => setIsCreateCompanyOpen(false)}
        />
        <JoinCompanyModal
          isOpen={isJoinCompanyOpen}
          onClose={() => setIsJoinCompanyOpen(false)}
        />
        <InviteEmployeeModal
          isOpen={isInviteEmployeeOpen}
          onClose={() => setIsInviteEmployeeOpen(false)}
        />
      </div>
    </CompanyProvider>
  );
};

export function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
