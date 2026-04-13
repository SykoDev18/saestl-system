import { api } from '../api/client';

export interface UserConfigResponse {
  token?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  numeroCuenta?: string | null;
  carrera?: string | null;
  semestre?: string | null;
  bio?: string | null;
  role: string;
  theme: 'dark' | 'light' | 'auto';
  accentColor: string;
  language: string;
  notifEmail: boolean;
  notifPush: boolean;
  notifSms: boolean;
  notifEventos: boolean;
  notifPresupuestos: boolean;
  notifTransacciones: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phone: string;
  numeroCuenta: string;
  carrera: string;
  semestre: string;
  bio: string;
}

export interface UpdatePreferencesRequest {
  theme: 'dark' | 'light' | 'auto';
  accentColor: string;
  language: string;
  notifEmail: boolean;
  notifPush: boolean;
  notifSms: boolean;
  notifEventos: boolean;
  notifPresupuestos: boolean;
  notifTransacciones: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const configService = {
  get: () => api.get<UserConfigResponse>('/config'),
  updateProfile: (data: UpdateProfileRequest) => api.put<UserConfigResponse>('/config/profile', data),
  updatePreferences: (data: UpdatePreferencesRequest) => api.put<UserConfigResponse>('/config/preferences', data),
  changePassword: (data: ChangePasswordRequest) => api.put<void>('/config/password', data),
};