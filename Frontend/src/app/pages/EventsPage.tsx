import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Plus, CalendarDays, List, Clock, MapPin, Users, Search, X,
  ChevronLeft, ChevronRight, DollarSign
} from 'lucide-react';
import type { Event } from '../data/mockData';
import { EventDetailModal } from '../components/events/EventDetailModal';
import { CreateEventWizard } from '../components/events/CreateEventWizard';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';
import { toast } from 'sonner';
import { eventService } from '../services/eventService';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

const typeColors: Record<string, string> = {
  deportivo: '#e87722', academico: '#5B9BF6', cultural: '#D71921', social: '#4A9E5C',
};

const statusMap: Record<string, { color: string; label: string }> = {
  proximo: { color: nd.success, label: 'PROXIMO' },
  en_curso: { color: '#5B9BF6', label: 'EN CURSO' },
  finalizado: { color: nd.textDisabled, label: 'FINALIZADO' },
  cancelado: { color: nd.error, label: 'CANCELADO' },
};

const DAYS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'calendario' | 'lista'>('calendario');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { isHidden, formatMoney } = useFinancialPrivacy();

  const today = new Date(2026, 2, 16);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
    const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ date: prevMonthDays - i, month: calMonth - 1, year: calYear, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: i, month: calMonth, year: calYear, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: i, month: calMonth + 1, year: calYear, isCurrentMonth: false });
    return days;
  }, [calMonth, calYear]);

  const getEventsForDay = (date: number, month: number, year: number) => events.filter((event: Event) => { const d = new Date(event.date); return d.getDate() === date && d.getMonth() === month && d.getFullYear() === year; });
  const isToday = (date: number, month: number, year: number) => date === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const filteredEvents = useMemo(() => events.filter((event: Event) => {
    if (search && !event.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'todos' && event.type !== filterType) return false;
    if (filterStatus !== 'todos' && event.status !== filterStatus) return false;
    return true;
  }), [events, search, filterType, filterStatus]);

  const closeModals = useCallback(() => {
    setShowCreate(false);
    setSelectedEvent(null);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModals(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeModals]);

  useEffect(() => {
    eventService
      .list()
      .then(setEvents)
      .catch(() => toast.error('No se pudieron cargar los eventos'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'registered' | 'participants'>) => {
    try {
      const createdEvent = await eventService.create({ ...eventData, registered: 0 });
      setEvents((prev: Event[]) => [createdEvent, ...prev]);
      setShowCreate(false);
      toast.success('[CREATED]');
    } catch {
      toast.error('No se pudo guardar el evento');
    }
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Eventos
          </h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
            ORGANIZA Y GESTIONA
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 cursor-pointer shrink-0"
          style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}>
          <Plus size={16} strokeWidth={1.5} /> CREAR
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'TOTAL', value: events.length.toString(), color: nd.textDisplay },
          { label: 'PROXIMOS', value: events.filter((event: Event) => event.status === 'proximo').length.toString(), color: nd.success },
          { label: 'REGISTRADOS', value: events.reduce((total: number, event: Event) => total + event.registered, 0).toString(), color: '#5B9BF6' },
          { label: 'PRESUPUESTO', value: formatMoney(events.reduce((total: number, event: Event) => total + event.budget, 0)), color: nd.warning },
        ].map(s => (
          <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
            <p style={{ fontFamily: mono, fontSize: '22px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '6px' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', marginBottom: '24px', maxWidth: '280px' }}>
        {[
          { key: 'calendario' as const, label: 'CALENDARIO', icon: CalendarDays },
          { key: 'lista' as const, label: 'LISTA', icon: List },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            className="flex-1 h-9 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', borderRadius: '999px',
              background: view === tab.key ? nd.textDisplay : 'transparent',
              color: view === tab.key ? nd.black : nd.textSecondary,
            }}>
            <tab.icon size={14} strokeWidth={1.5} /> {tab.label}
          </button>
        ))}
      </div>

      {/* CALENDAR VIEW */}
      {view === 'calendario' && (
        <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${nd.border}` }}>
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
              className="cursor-pointer" style={{ color: nd.textSecondary }}>
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <span style={{ fontFamily: mono, fontSize: '14px', letterSpacing: '0.04em', color: nd.textDisplay }}>
              {MONTHS[calMonth].toUpperCase()} {calYear}
            </span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
              className="cursor-pointer" style={{ color: nd.textSecondary }}>
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${nd.border}` }}>
            {DAYS.map(day => (
              <div key={day} className="py-2 text-center" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textDisabled }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day: { date: number; month: number; year: number; isCurrentMonth: boolean }, idx: number) => {
              const dayEvents = day.isCurrentMonth ? getEventsForDay(day.date, day.month, day.year) : [];
              const isCurrent = isToday(day.date, day.month, day.year);
              return (
                <div key={idx} className="relative p-1.5 cursor-pointer" style={{
                  minHeight: '90px',
                  borderRight: idx % 7 < 6 ? `1px solid ${nd.border}` : 'none',
                  borderBottom: `1px solid ${nd.border}`,
                  background: isCurrent ? nd.surfaceRaised : 'transparent',
                }}>
                  <div className="text-right mb-1">
                    <span style={{
                      fontFamily: mono, fontSize: '11px',
                      color: !day.isCurrentMonth ? nd.border : isCurrent ? nd.textDisplay : nd.textSecondary,
                      fontWeight: isCurrent ? 700 : 400,
                    }}>
                      {day.date}
                    </span>
                    {isCurrent && <div className="w-1 h-1 rounded-full ml-auto" style={{ background: nd.accent }} />}
                  </div>
                  {day.isCurrentMonth && dayEvents.slice(0, 2).map(ev => {
                    const tc = typeColors[ev.type] || nd.textSecondary;
                    return (
                      <button key={ev.id} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                        className="w-full text-left px-1.5 py-0.5 mb-0.5 cursor-pointer transition-opacity duration-150 hover:opacity-80"
                        style={{ borderLeft: `2px solid ${tc}`, fontSize: '10px', color: nd.textPrimary }}>
                        <div className="truncate">{ev.name}</div>
                      </button>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, textAlign: 'center' }}>+{dayEvents.length - 2}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 px-5 py-3" style={{ borderTop: `1px solid ${nd.border}` }}>
            {Object.entries(typeColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-[2px]" style={{ background: color }} />
                <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.06em', color: nd.textSecondary }}>{key.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'lista' && (
        <div>
          {loading && (
            <div className="mb-4 py-6 text-center" style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
              <p style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, letterSpacing: '0.06em' }}>[CARGANDO EVENTOS]</p>
            </div>
          )}
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '16px' }}>
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: nd.textDisabled }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="BUSCAR..."
                className="w-full outline-none" style={{ fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`, padding: '8px 0 8px 24px' }} />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
              <option value="todos">TIPO</option>
              <option value="deportivo">DEPORT</option>
              <option value="academico">ACAD</option>
              <option value="cultural">CULT</option>
              <option value="social">SOCIAL</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
              <option value="todos">ESTADO</option>
              <option value="proximo">PROX</option>
              <option value="en_curso">CURSO</option>
              <option value="finalizado">FIN</option>
              <option value="cancelado">CANC</option>
            </select>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center" style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
              <CalendarDays size={32} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: nd.textDisabled }} />
              <p style={{ fontFamily: mono, fontSize: '12px', color: nd.textSecondary, letterSpacing: '0.06em' }}>[NO HAY EVENTOS]</p>
            </div>
          ) : (
            <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
              {filteredEvents.map((event, i) => {
                const tc = typeColors[event.type] || nd.textSecondary;
                const sc = statusMap[event.status] || statusMap.proximo;
                const d = new Date(event.date);
                const pct = event.capacity > 0 ? Math.round((event.registered / event.capacity) * 100) : 0;
                const segments = 15;
                const filled = Math.round((pct / 100) * segments);

                return (
                  <div key={event.id}
                    className="px-5 py-4 cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: i < filteredEvents.length - 1 ? `1px solid ${nd.border}` : 'none', borderLeft: `3px solid ${tc}` }}
                    onClick={() => setSelectedEvent(event)}
                    onMouseEnter={e => e.currentTarget.style.background = nd.surfaceRaised}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center shrink-0" style={{ width: '40px' }}>
                          <div style={{ fontFamily: mono, fontSize: '20px', fontWeight: 700, color: nd.textDisplay, lineHeight: 1 }}>
                            {d.getDate()}
                          </div>
                          <div style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.06em' }}>
                            {d.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', color: nd.textPrimary }}>{event.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1" style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>
                              <MapPin size={10} strokeWidth={1.5} /> {event.location}
                            </span>
                            <span className="flex items-center gap-1" style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>
                              <Clock size={10} strokeWidth={1.5} /> {event.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Segmented bar */}
                        <div className="flex gap-[1px]">
                          {Array.from({ length: segments }).map((_, idx) => (
                            <div key={`ev-seg-${event.id}-${idx}`} style={{ width: '6px', height: '6px', background: idx < filled ? tc : nd.border }} />
                          ))}
                        </div>
                        <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary }}>
                          {event.registered}/{event.capacity}
                        </span>
                        <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: sc.color }}>
                          [{sc.label}]
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreate && <CreateEventWizard onClose={() => setShowCreate(false)} onCreate={handleCreateEvent} />}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
