import React, { useState, useMemo } from 'react';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onRegisteredSuccess: (email: string) => void;
  onNavigateLanding?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
  onRegisteredSuccess,
  onNavigateLanding,
}) => {
  const { register, isLoading } = useAuth();

  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>(() => {
    return sessionStorage.getItem('companyconnect_signup_email') || '';
  });
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  // Live password strength calculation
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-[#ea4335]' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-[#fbbc04]' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-[#1a73e8]' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-[#34a853]' };
      default:
        return { score: 0, label: 'Too short', color: 'bg-gray-300 dark:bg-gray-700' };
    }
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isSubmitDisabled =
    isLoading ||
    !name.trim() ||
    !username.trim() ||
    password.length < 8 ||
    password.length > 15 ||
    !passwordsMatch ||
    !agreeTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const success = await register(name.trim(), username.trim(), password);
    if (success) {
      onRegisteredSuccess(username.trim());
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="to get started with Relay Enterprise"
      isLoading={isLoading}
      onNavigateLanding={onNavigateLanding}
      footerActions={
        <div className="space-y-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-sm text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Already have an account? Sign in</span>
          </button>

          {onNavigateLanding && (
            <div>
              <button
                type="button"
                onClick={onNavigateLanding}
                className="text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] hover:underline inline-flex items-center gap-1 font-medium"
              >
                ← Back to Product Overview
              </button>
            </div>
          )}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Demis Hassabis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="google-input google-input-with-icon text-sm"
            />
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Corporate Email */}
        <div>
          <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
            Corporate Email Address
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="demis@deepmind.corp"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="google-input google-input-with-icon text-sm"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
              Password (8-15 characters)
            </label>
            {password && (
              <span className="text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6]">
                {strength.label}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              minLength={8}
              maxLength={15}
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

          {/* Password Strength Progress Bar */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="grid grid-cols-4 gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-all duration-300 ${
                      strength.score >= step
                        ? strength.color
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
                <span>{password.length}/15 chars</span>
                <span>Use letters, numbers & symbols</span>
              </div>
            </div>
          )}

          {/* Caps Lock Warning */}
          {isCapsLockOn && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Caps Lock is on</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="google-input google-input-with-icon google-input-with-action text-sm"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {confirmPassword && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px]">
              {passwordsMatch ? (
                <span className="text-[#137333] dark:text-[#81c995] inline-flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Passwords match</span>
                </span>
              ) : (
                <span className="text-[#ea4335] dark:text-[#f28b82] inline-flex items-center gap-1 font-medium">
                  <X className="w-3.5 h-3.5" />
                  <span>Passwords do not match</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-1">
          <label className="inline-flex items-start gap-2 cursor-pointer select-none text-xs text-[#5f6368] dark:text-[#9aa0a6]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#1a73e8] focus:ring-[#1a73e8] accent-[#1a73e8]"
            />
            <span>
              I agree to the Enterprise Workspace acceptable use guidelines and communications policies.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full google-btn-primary py-3 text-sm mt-2 font-medium ${
            isSubmitDisabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <>
              <span>Next: Verify Email</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
