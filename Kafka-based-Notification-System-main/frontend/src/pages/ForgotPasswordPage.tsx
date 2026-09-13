import React, { useState, useMemo } from 'react';
import { KeyRound, Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, Check, X, RotateCw, AlertCircle, Sparkles } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/auth/AuthLayout';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateLanding?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const { showToast } = useToast();

  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [username, setUsername] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  // Password strength calculation
  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
    if (/\d/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

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
  }, [newPassword]);

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await authApi.sendResetOtp(username.trim());
      showToast('A 6-digit recovery code was dispatched to your email', 'success');
      setStep('verify');
      setResendCountdown(60);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Account not found with this email';
      showToast(typeof msg === 'string' ? msg : 'Failed to dispatch reset code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      await authApi.sendResetOtp(username.trim());
      showToast('A fresh reset code was dispatched', 'success');
      setResendCountdown(60);
    } catch {
      showToast('Could not resend code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword || !passwordsMatch || newPassword.length < 8) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        username: username.trim(),
        otp: otp.trim(),
        newPassword,
      });
      showToast('Password updated successfully! You may now sign in.', 'success');
      onNavigateLogin();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Invalid or expired OTP code';
      showToast(typeof msg === 'string' ? msg : 'Password reset failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'send' ? 'Account Recovery' : 'Reset your password'}
      subtitle={
        step === 'send'
          ? 'Enter your corporate email to receive a secure recovery code'
          : `Enter the code sent to ${username}`
      }
      icon={
        <div className="w-13 h-13 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#fbbc04] dark:text-[#fdd663] flex items-center justify-center shadow-google-sm">
          <KeyRound className="w-7 h-7" />
        </div>
      }
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
            <span>Return to sign in</span>
          </button>
        </div>
      }
    >
      {/* Step Indicator Pills */}
      <div className="flex items-center justify-center gap-2 mb-6 text-xs">
        <span
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            step === 'send'
              ? 'bg-[#1a73e8] text-white'
              : 'bg-green-100 dark:bg-green-950/40 text-[#137333] dark:text-[#81c995]'
          }`}
        >
          1. Verify Email
        </span>
        <span className="text-gray-300 dark:text-gray-600">→</span>
        <span
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            step === 'verify'
              ? 'bg-[#1a73e8] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}
        >
          2. New Password
        </span>
      </div>

      {step === 'send' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Corporate Email Address
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="name@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="google-input google-input-with-icon text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full google-btn-primary py-3 text-sm mt-2 font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending code...</span>
              </div>
            ) : (
              <>
                <span>Send Recovery Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email recap banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafd] dark:bg-[#131314] border border-[#dadce0] dark:border-[#3c4043] text-xs">
            <div className="truncate">
              <span className="text-gray-400">Sending to: </span>
              <span className="font-semibold text-[#202124] dark:text-[#e3e3e3]">{username}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('send')}
              className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium ml-2 shrink-0"
            >
              Change
            </button>
          </div>

          {/* OTP Code Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                6-Digit Recovery Code
              </label>
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="text-[11px] text-[#1a73e8] dark:text-[#8ab4f8] hover:underline flex items-center gap-1 font-mono"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Demo (123456)</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="123456"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                className="google-input text-sm tracking-widest font-mono text-center"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                New Password (8-15 chars)
              </label>
              {newPassword && (
                <span className="text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6]">
                  {strength.label}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                minLength={8}
                maxLength={15}
                onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Password Strength Progress */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`rounded-full transition-all duration-300 ${
                        strength.score >= s ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {isCapsLockOn && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Caps Lock is on</span>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider mb-1.5">
              Confirm New Password
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

          <button
            type="submit"
            disabled={isLoading || !otp.trim() || !passwordsMatch || newPassword.length < 8}
            className="w-full google-btn-primary py-3 text-sm mt-2 font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Resetting password...</span>
              </div>
            ) : (
              <>
                <span>Set New Password & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};
