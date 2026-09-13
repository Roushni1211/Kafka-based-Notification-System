import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { authApi } from '../api/authApi';
import { MOCK_USER } from '../api/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, username: string, password: string) => Promise<boolean>;
  verifyOtp: (username: string, otp: string) => Promise<boolean>;
  logout: () => void;
  toggleDemoMode: (enable?: boolean) => void;
  updateUserName: (name: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('companyconnect_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('companyconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('companyconnect_demo') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (isDemoMode) {
      setUser(MOCK_USER);
      setIsLoading(false);
      return;
    }

    const currentToken = localStorage.getItem('companyconnect_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('companyconnect_user', JSON.stringify(profile));
    } catch (err: any) {
      console.warn('Failed to load profile from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, token]);

  const toggleDemoMode = (enable?: boolean) => {
    const nextState = enable !== undefined ? enable : !isDemoMode;
    setIsDemoMode(nextState);
    localStorage.setItem('companyconnect_demo', String(nextState));

    if (nextState) {
      setUser(MOCK_USER);
      showToast('Demo Mode Activated! Exploring with pristine Workspace data.', 'info');
    } else {
      if (token) {
        fetchProfile();
      } else {
        setUser(null);
      }
      showToast('Switched to Live Backend Mode', 'info');
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const jwtToken = await authApi.login({ username, password });
      setToken(jwtToken);
      localStorage.setItem('companyconnect_token', jwtToken);
      setIsDemoMode(false);
      localStorage.setItem('companyconnect_demo', 'false');

      // Fetch profile
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('companyconnect_user', JSON.stringify(profile));
      showToast(`Welcome back, ${profile.name}!`, 'success');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Invalid email or password';
      showToast(typeof errorMsg === 'string' ? errorMsg : 'Authentication failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ name, username, password });
      showToast(response || 'Verification code sent to your email!', 'success');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Registration failed';
      showToast(typeof errorMsg === 'string' ? errorMsg : 'Could not create account', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (username: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authApi.verifyOtp({ username, otp });
      showToast('Account verified successfully! You can now sign in.', 'success');
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Invalid or expired OTP code';
      showToast(typeof errorMsg === 'string' ? errorMsg : 'Verification failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserName = async (name: string): Promise<boolean> => {
    if (isDemoMode) {
      setUser((prev) => (prev ? { ...prev, name } : null));
      showToast('Profile name updated!', 'success');
      return true;
    }

    try {
      const updated = await authApi.updateProfile(name);
      setUser(updated);
      localStorage.setItem('companyconnect_user', JSON.stringify(updated));
      showToast('Profile updated successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast('Failed to update profile', 'error');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('companyconnect_token');
    localStorage.removeItem('companyconnect_user');
    localStorage.removeItem('companyconnect_demo');
    showToast('Signed out of Workspace account', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || isDemoMode,
        isLoading,
        isDemoMode,
        login,
        register,
        verifyOtp,
        logout,
        toggleDemoMode,
        updateUserName,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
