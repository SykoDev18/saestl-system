import { api } from '../api/client';
import type { Rifa } from '../data/mockData';

export interface RifaCreateRequest {
  name: string;
  description?: string;
  prize?: string;
  pricePerTicket: number;
  totalTickets: number;
  drawDate: string;
}

export interface SellTicketsRequest {
  ticketNumbers: number[];
  buyerName: string;
  buyerPhone?: string;
  buyerEmail?: string;
  paid?: boolean;
}

export const rifaService = {
  list: () => api.get<Rifa[]>('/rifas'),
  create: (data: RifaCreateRequest) => api.post<Rifa>('/rifas', data),
  sellTickets: (rifaId: string, data: SellTicketsRequest) =>
    api.post<Rifa>(`/rifas/${rifaId}/vender`, data),
  drawWinner: (rifaId: string) =>
    api.post<Rifa>(`/rifas/${rifaId}/sortear`, {}),
  close: (rifaId: string) =>
    api.post<Rifa>(`/rifas/${rifaId}/cerrar`, {}),
  reopen: (rifaId: string) =>
    api.post<Rifa>(`/rifas/${rifaId}/abrir`, {}),
};