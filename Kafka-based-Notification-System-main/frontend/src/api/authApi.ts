import { apiClient } from './client';
import { UserProfile } from '../types';

export interface RegisterPayload {
  name: string;
  username: string; // email
  password: string;
}

export interface VerifyOtpPayload {
  username: string;
  otp: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ResetPasswordPayload {
  username: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  // Register user - returns message "Email Sent Successfully"
  register: async (payload: RegisterPayload): Promise<string> => {
    const res = await apiClient.post<string>('/auth/register', payload);
    return res.data;
  },

  // Verify registration OTP - returns saved user string
  verifyOtp: async (payload: VerifyOtpPayload): Promise<string> => {
    const res = await apiClient.post<string>('/auth/verify-otp', payload);
    return res.data;
  },

  // Login - returns JWT token string directly
  login: async (payload: LoginPayload): Promise<string> => {
    const res = await apiClient.post<string>('/auth/login', payload);
    return res.data;
  },

  // Send password reset OTP
  sendResetOtp: async (username: string): Promise<string> => {
    const res = await apiClient.post<string>('/auth/send-otp', null, {
      params: { username },
    });
    return res.data;
  },

  // Reset password
  resetPassword: async (payload: ResetPasswordPayload): Promise<string> => {
    const res = await apiClient.put<string>('/auth/updatePass', payload);
    return res.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>('/user/me');
    return res.data;
  },

  // Update profile name
  updateProfile: async (name: string): Promise<UserProfile> => {
    const res = await apiClient.put<UserProfile>('/user/profile', { name });
    return res.data;
  },
};
