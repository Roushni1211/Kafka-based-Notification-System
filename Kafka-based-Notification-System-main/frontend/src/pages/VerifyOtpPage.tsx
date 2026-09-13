import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, RotateCw, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/auth/AuthLayout';

interface VerifyOtpPageProps {
  email: string;
  onVerifiedSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding?: () => void;
}

export const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({
  email,
  onVerifiedSuccess,
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const { verifyOtp, isLoading } = useAuth();
  const { showToast } = useToast();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((p) => p - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const triggerVerification = async (code: string) => {
    if (code.length < 6) return;
    const success = await verifyOtp(email, code);
    if (success) {
      onVerifiedSuccess();
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit on last digit
    if (val && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        triggerVerification(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    if (pasted.length === 6) {
      triggerVerification(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await authApi.sendResetOtp(email);
      showToast('A fresh 6-digit verification code was sent to your email', 'success');
      setResendCountdown(60);
    } catch {
      showToast('Could not resend verification code. Please try again.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleFillDemoOtp = () => {
    const demoCode = ['1', '2', '3', '4', '5', '6'];
    setDigits(demoCode);
    triggerVerification('123456');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) {
      showToast('Please enter the complete 6-digit verification code', 'error');
      return;
    }
    triggerVerification(otp);
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        <div className="space-y-1">
          <p>We've sent a 6-digit security code to</p>
          <p className="font-semibold text-[#202124] dark:text-[#e3e3e3] inline-flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{email || 'your email address'}</span>
          </p>
        </div>
      }
      icon={
        <div className="w-13 h-13 rounded-2xl bg-green-50 dark:bg-green-950/40 text-[#34a853] dark:text-[#81c995] flex items-center justify-center shadow-google-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
      }
      isLoading={isLoading || isResending}
      onNavigateLanding={onNavigateLanding}
      footerActions={
        <div className="space-y-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-sm text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6 Digits Boxes */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider text-center">
            Enter 6-Digit Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-2xl border bg-transparent outline-none transition-all duration-150 ${
                  digit
                    ? 'border-[#1a73e8] dark:border-[#8ab4f8] bg-blue-50/40 dark:bg-blue-900/20 text-[#1a73e8] dark:text-[#8ab4f8]'
                    : 'border-[#dadce0] dark:border-[#3c4043] focus:border-[#1a73e8] dark:focus:border-[#8ab4f8] focus:ring-2 focus:ring-[#1a73e8]/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resend Controls */}
        <div className="flex flex-col items-center justify-center text-xs space-y-2">
          {resendCountdown > 0 ? (
            <span className="text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1.5">
              <span>Didn't get a code? Resend in</span>
              <span className="font-mono font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
                {resendCountdown}s
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-semibold inline-flex items-center gap-1.5"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend verification code</span>
            </button>
          )}

          {/* Quick Demo OTP Pill */}
          <button
            type="button"
            onClick={handleFillDemoOtp}
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] hover:underline"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fill Demo Code (123456)</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || digits.some((d) => !d)}
          className="w-full google-btn-primary py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying code...</span>
            </div>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
