import { apiClient } from './client';
import { User, ApiResponse } from '@/types';

export interface SendOTPRequest {
  phoneNumber: string;
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async sendOTP(data: SendOTPRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/send-otp', data);
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/auth/verify-otp', data);
  }

  async refreshToken(token: string): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/auth/refresh', { token });
  }

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post('/auth/logout');
  }
}

export const authService = new AuthService();

