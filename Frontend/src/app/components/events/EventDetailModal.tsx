import { useState } from 'react';
import {
  X, MapPin, Clock, Users, Calendar, DollarSign, User,
  CheckCircle, AlertCircle, XCircle, Search, FileDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Event } from '../../data/mockData';
import { useFinancialPrivacy } from '../FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

const typeColors: Record<string, string> = {
  deportivo: '#e87722', academico: '#5B9BF6', cultural: '#D71921', social: '#4A9E5C',
};

interface Props { event: Event; onClose: () => void; }

export function EventDetailModal({ event, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'participantes' | 'estadisticas'>('info');
  const [searchParticipant, setSearchParticipant] = useState('');
  const { isHidden, formatMoney } = useFinancialPrivacy();

  const tc = typeColors[event.type] || nd.textSecondary;
  const d = new Date(event.date);
  const pct = event.capacity > 0 ? Math.round((event.registered / event.capacity) * 100) : 0;
  const participants = event.participants || [];
  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchParticipant.toLowerCase()) ||
    p.registrationNumber.toLowerCase().includes(searchParticipant.toLowerCase())
  );
  const paidCount = participants.filter(p => p.paymentStatus === 'pagado').length;
  const totalIncome = paidCount * (event.cost || 0);
  const segments = 20;
  const filled = Math.round((pct / 100) * segments);

  const paymentPieData = [
    { name: 'Pagado', value: paidCount || 1, fill: nd.success },
    { name: 'Pendiente', value: participants.filter(p => p.paymentStatus === 'pendiente').length || 0, fill: nd.warning },
    { name: 'Vencido', value: participants.filter(p => p.paymentStatus === 'vencido').length || 0, fill: nd.error },
  ].filter(d => d.value > 0);

  const registrationByDay = [
    { day: '10', registros: 1 }, { day: '11', registros: 2 }, { day: '12', registros: 3 },
    { day: '13', registros: 4 }, { day: '14', registros: 5 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="w-full max-w-[800px] my-8" style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: `1px solid ${nd.border}` }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6" style={{ background: tc, borderRadius: '1px' }} />
              <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: tc }}>{event.type.toUpperCase()}</span>
            </div>
            <h2 style={{ fontSize: '22px', color: nd.textDisplay, fontFamily: "'Space Grotesk', sans-serif" }}>{event.name}</h2>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="flex items-center gap-1" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>
                <Calendar size={12} strokeWidth={1.5} /> {d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>
                <Clock size={12} strokeWidth={1.5} /> {event.time}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ color: nd.textDisabled }}><X size={18} strokeWidth={1.5} /></button>
        </div>

        {/* Tabs */}
        <div className="flex px-6" style={{ borderBottom: `1px solid ${nd.border}` }}>
          {[
            { key: 'info' as const, label: 'INFO' },
            { key: 'participantes' as const, label: 'PARTICIPANTES' },
            { key: 'estadisticas' as const, label: 'STATS' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-4 py-3 cursor-pointer relative"
              style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: activeTab === tab.key ? nd.textDisplay : nd.textDisabled }}>
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: tc }} />}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* INFO */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
              <div className="space-y-6">
                <div>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '8px' }}>DESCRIPCION</span>
                  <p style={{ fontSize: '14px', color: nd.textPrimary, lineHeight: '1.6' }}>{event.description}</p>
                </div>
                {event.requirements && event.requirements.length > 0 && (
                  <div>
                    <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '8px' }}>REQUISITOS</span>
                    <ul className="space-y-2">
                      {event.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2" style={{ fontSize: '13px', color: nd.textPrimary }}>
                          <CheckCircle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: nd.success }} /> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {event.notes && (
                  <div style={{ padding: '12px', border: `1px solid ${nd.warning}`, borderRadius: '8px' }}>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: nd.warning, letterSpacing: '0.06em' }}>[NOTA]</span>
                    <p style={{ fontSize: '13px', color: nd.textPrimary, marginTop: '4px' }}>{event.notes}</p>
                  </div>
                )}
              </div>

              <div style={{ background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '16px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '16px' }}>DETALLES</span>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: 'UBICACION', value: event.location },
                    { icon: Users, label: 'CAPACIDAD', value: `${event.registered}/${event.capacity}` },
                    { icon: DollarSign, label: 'COSTO', value: event.cost === 0 ? 'GRATIS' : formatMoney(event.cost) },
                    ...(event.organizer ? [{ icon: User, label: 'ORGANIZADOR', value: event.organizer }] : []),
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon size={12} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
                        <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.08em', color: nd.textDisabled }}>{item.label}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: nd.textPrimary, marginLeft: '20px' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Segmented progress */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${nd.border}` }}>
                  <div className="flex gap-[2px]">
                    {Array.from({ length: segments }).map((_, i) => (
                      <div key={`detail-seg-${i}`} style={{ flex: 1, height: '6px', background: i < filled ? tc : nd.border }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: tc, marginTop: '4px', display: 'block' }}>{pct}% OCUPACION</span>
                </div>
              </div>
            </div>
          )}

          {/* PARTICIPANTES */}
          {activeTab === 'participantes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, letterSpacing: '0.06em' }}>
                  REGISTROS: {participants.length}
                </span>
                <div className="relative">
                  <Search size={12} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: nd.textDisabled }} />
                  <input value={searchParticipant} onChange={e => setSearchParticipant(e.target.value)} placeholder="BUSCAR..."
                    className="outline-none" style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary, background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`, padding: '6px 0 6px 20px', width: '160px' }} />
                </div>
              </div>
              {participants.length === 0 ? (
                <div className="py-12 text-center">
                  <p style={{ fontFamily: mono, fontSize: '12px', color: nd.textDisabled }}>[SIN REGISTROS]</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${nd.borderVisible}` }}>
                      {['#', 'NOMBRE', 'TEL', 'PAGO'].map(h => (
                        <th key={h} className="text-left py-2 px-3" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${nd.border}` }}>
                        <td className="py-2 px-3" style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisabled }}>{i + 1}</td>
                        <td className="py-2 px-3">
                          <p style={{ fontSize: '13px', color: nd.textPrimary }}>{p.name}</p>
                          <p style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>{p.registrationNumber}</p>
                        </td>
                        <td className="py-2 px-3" style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisabled }}>{p.phone}</td>
                        <td className="py-2 px-3">
                          <span style={{
                            fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em',
                            color: p.paymentStatus === 'pagado' ? nd.success : p.paymentStatus === 'vencido' ? nd.error : nd.warning,
                          }}>
                            [{p.paymentStatus === 'pagado' ? 'PAGADO' : p.paymentStatus === 'vencido' ? 'VENC' : 'PEND'}]
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ESTADISTICAS */}
          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'REGISTROS', value: event.registered.toString(), color: tc },
                  { label: 'INGRESOS', value: formatMoney(totalIncome), color: nd.success },
                  { label: 'ASISTENCIA', value: `${participants.filter(p => p.attended).length}`, color: '#5B9BF6' },
                ].map(s => (
                  <div key={s.label} style={{ background: nd.surfaceRaised, borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</span>
                    <p style={{ fontFamily: mono, fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '8px' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div style={{ background: nd.surfaceRaised, borderRadius: '8px', padding: '16px' }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '16px' }}>REGISTROS/DIA</span>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={registrationByDay}>
                      <CartesianGrid stroke={nd.border} horizontal vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary }} />
                      <Line type="monotone" dataKey="registros" stroke={tc} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: nd.surfaceRaised, borderRadius: '8px', padding: '16px' }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '16px' }}>PAGOS</span>
                  {participants.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={paymentPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" strokeWidth={0}>
                            {paymentPieData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-3">
                        {paymentPieData.map(d => (
                          <span key={d.name} style={{ fontFamily: mono, fontSize: '9px', color: nd.textSecondary, letterSpacing: '0.04em' }}>
                            {d.name.toUpperCase()} {d.value}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center py-8" style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisabled }}>[SIN DATOS]</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
