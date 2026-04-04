import { api } from '../api/client';

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  email: string;
  fullName: string;
  role: string;
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: { email: string; password: string; fullName: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  me: () =>
    api.get<UserProfile>('/auth/me'),
};
