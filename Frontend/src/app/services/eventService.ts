import { api } from '../api/client';
import type { Event } from '../data/mockData';

export type EventRequest = Omit<Event, 'id' | 'registered' | 'participants'> & {
  registered?: number;
};

export const eventService = {
  list: () => api.get<Event[]>('/eventos'),
  create: (data: EventRequest) => api.post<Event>('/eventos', data),
};