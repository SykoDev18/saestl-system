import { api } from '../api/client';
import type { Transaction } from '../data/mockData';

export type TransactionPayload = Omit<Transaction, 'id'>;

export const transactionService = {
  list: () => api.get<Transaction[]>('/transacciones'),
  create: (data: TransactionPayload) => api.post<Transaction>('/transacciones', data),
  update: (id: string, data: TransactionPayload) => api.put<Transaction>(`/transacciones/${id}`, data),
  remove: (id: string) => api.delete<void>(`/transacciones/${id}`),
};