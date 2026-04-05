import { api } from '../api/client';
import type { Cuenta } from '../data/mockData';

export interface CuentaCreateRequest {
  description: string;
  amount: number;
  dueDate: string;
  supplier: string;
  category: string;
}

export const cuentaService = {
  list: () => api.get<Cuenta[]>('/cuentas'),
  create: (data: CuentaCreateRequest) => api.post<Cuenta>('/cuentas', data),
  markPaid: (id: string) => api.post<Cuenta>(`/cuentas/${id}/pagar`, {}),
};