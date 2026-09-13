import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, X, AlertCircle, Users, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
  onNavigateLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onNavigateForgot,
  onNavigateLanding,
}) => {
  const { login, isLoading, toggleDemoMode } = useAuth();

  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('companyconnect_remembered_email') || '';
  });
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return !!localStorage.getItem('companyconnect_remembered_email');
  });
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [showQuickFill, setShowQuickFill] = useState<boolean>(false);

  const quickPersonas = [
    { name: 'Demis Hassabis', role: 'Team Lead', email: 'demis@deepmind.corp', pass: 'Password123!' },
    { name: 'Sundar Pichai', role: 'Admin', email: 'sundar@enterprise.corp', pass: 'Password123!' },
    { name: 'Alex Mercer', role: 'Staff Engineer', email: 'alex@workspace.corp', pass: 'Password123!' },
  ];

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setUsername(email);
    setPassword(pass);
    setShowQuickFill(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    if (rememberMe) {
      localStorage.setItem('companyconnect_remembered_email', username.trim());
    } else {
      localStorage.removeItem('companyconnect_remembered_email');
    }

    await login(username.trim(), password);
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="to continue to Relay Workspace"
      isLoading={isLoading}
      onNavigateLanding={onNavigateLanding}
      footerActions={
        <div className="space-y-4">
          {/* Demo Mode Button */}
          <button
            type="button"
            onClick={() => toggleDemoMode(true)}
            className="w-full py-2.5 px-4 rounded-full bg-[#fef7e0] dark:bg-[#332a00] border border-[#fbbc04]/60 hover:border-[#f29900] text-[#b06000] dark:text-[#fdd663] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-[#f29900]" />
            <span>Explore Interactive Demo (No Backend Required)</span>
          </button>

          {/* Register Link */}
          <div className="text-sm text-[#5f6368] dark:text-[#9aa0a6] space-y-2">
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium"
              >
                Create account
              </button>
            </div>
            {onNavigateLanding && (
              <div>
                <button
                  type="button"
                  onClick={onNavigateLanding}
                  className="text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] hover:underline inline-flex items-center gap-1 font-medium pt-1"
                >
                  ← Back to Product Overview
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      {/* Quick Persona Fill Drawer */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#5f6368] dark:text-[#9aa0a6]">Testing credentials?</span>
          <button
            type="button"
            onClick={() => setShowQuickFill((p) => !p)}
            className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{showQuickFill ? 'Hide test personas' : 'Quick fill persona'}</span>
          </button>
        </div>

        {showQuickFill && (
          <div className="p-2.5 rounded-2xl bg-[#f8fafd] dark:bg-[#131314] border border-[#dadce0] dark:border-[#3c4043] space-y-1.5 animate-in fade-in duration-150">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5f6368] dark:text-[#9aa0a6] block px-1">
              Select Demo Persona
            </span>
            <div className="grid grid-cols-1 gap-1">
              {quickPersonas.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(p.email, p.pass)}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-[#28292a] text-left text-xs transition-colors border border-transparent hover:border-[#dadce0] dark:hover:border-[#3c4043]"
                >
                  <div className="truncate">
                    <span className="font-semibold text-[#202124] dark:text-[#e3e3e3]">{p.name}</span>
                    <span className="text-gray-400 text-[11px] ml-1.5">({p.role})</span>
                  </div>
                  <span className="text-[10px] text-[#1a73e8] dark:text-[#8ab4f8] font-mono">Fill</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Username */}
        <div>
          <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
            Email or Username
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="name@company.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="google-input google-input-with-icon google-input-with-action text-sm font-normal"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {username && (
              <button
                type="button"
                onClick={() => setUsername('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                tabIndex={-1}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={onNavigateForgot}
              className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyUp}
              required
              className="google-input google-input-with-icon google-input-with-action text-sm"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Caps Lock Warning */}
          {isCapsLockOn && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Caps Lock is on</span>
            </div>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#1a73e8] focus:ring-[#1a73e8] accent-[#1a73e8]"
            />
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              Remember my email
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full google-btn-primary py-3 text-sm mt-2 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
