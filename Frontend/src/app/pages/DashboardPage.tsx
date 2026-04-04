import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Wallet, TrendingUp, TrendingDown, Ticket, ArrowRight,
  Plus, FileDown, CalendarDays, MapPin, Clock, ArrowDownLeft, ArrowUpRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { transactions, events, budgets, rifas, chartData } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000000',
  surface: '#111111',
  surfaceRaised: '#1A1A1A',
  border: '#222222',
  borderVisible: '#333333',
  textDisabled: '#666666',
  textSecondary: '#999999',
  textPrimary: '#E8E8E8',
  textDisplay: '#FFFFFF',
  accent: '#8B1C23',
  success: '#4A9E5C',
  warning: '#D4A843',
  error: '#D71921',
  raffle: '#a855f7',
};

const quickActions = [
  { label: 'NUEVA TX', icon: Plus, path: '/transacciones' },
  { label: 'NUEVA RIFA', icon: Ticket, path: '/rifas' },
  { label: 'NUEVO EVENTO', icon: CalendarDays, path: '/eventos' },
  { label: 'EXPORTAR', icon: FileDown, path: '/reportes' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { isHidden, formatMoney } = useFinancialPrivacy();
  const recentTransactions = transactions.slice(0, 5);
  const upcomingEvents = events.filter(e => e.status === 'proximo').slice(0, 3);

  const stats = useMemo(() => {
    const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0);
    const totalEgresos = transactions.filter(t => t.type === 'egreso').reduce((a, t) => a + t.amount, 0);
    const balance = totalIngresos - totalEgresos;
    const ingresoCount = transactions.filter(t => t.type === 'ingreso').length;
    const egresoCount = transactions.filter(t => t.type === 'egreso').length;
    const activeRifas = rifas.filter(r => r.status === 'activa');
    const totalSoldTickets = activeRifas.reduce((a, r) => a + r.soldTickets, 0);
    return { totalIngresos, totalEgresos, balance, ingresoCount, egresoCount, activeRifas: activeRifas.length, totalSoldTickets };
  }, []);

  const statsCards = [
    { label: 'BALANCE ACTUAL', value: formatMoney(stats.balance), color: nd.success, icon: Wallet, isFinancial: true },
    { label: 'INGRESOS MES', value: formatMoney(stats.totalIngresos), info: `${stats.ingresoCount} TX`, color: nd.textDisplay, icon: TrendingUp, isFinancial: true },
    { label: 'EGRESOS MES', value: formatMoney(stats.totalEgresos), info: `${stats.egresoCount} TX`, color: nd.error, icon: TrendingDown, isFinancial: true },
    { label: 'RIFAS ACTIVAS', value: stats.activeRifas.toString(), info: `${stats.totalSoldTickets} BOLETOS`, color: nd.raffle, icon: Ticket, isFinancial: false },
  ];

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Page title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Doto', 'Space Mono', monospace",
          fontSize: '36px',
          fontWeight: 700,
          color: nd.textDisplay,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          Dashboard
        </h1>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: nd.textSecondary,
          textTransform: 'uppercase',
          marginTop: '8px',
        }}>
          RESUMEN FINANCIERO — SOCIEDAD DE ALUMNOS
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: '32px' }}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 cursor-pointer transition-all duration-150"
            style={{
              height: '48px',
              padding: '0 16px',
              background: 'transparent',
              border: `1px solid ${nd.borderVisible}`,
              borderRadius: '999px',
              color: nd.textPrimary,
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.06em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = nd.textDisplay;
              e.currentTarget.style.color = nd.textDisplay;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = nd.borderVisible;
              e.currentTarget.style.color = nd.textPrimary;
            }}
          >
            <action.icon size={16} strokeWidth={1.5} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {statsCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: nd.surface,
              border: `1px solid ${nd.border}`,
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: nd.textSecondary,
                  textTransform: 'uppercase',
                }}>
                  {card.label}
                </p>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '32px',
                  fontWeight: 700,
                  color: card.color,
                  marginTop: '8px',
                  lineHeight: 1,
                }}>
                  {card.value}
                </p>
                {card.info && (
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    color: nd.textDisabled,
                    letterSpacing: '0.06em',
                    marginTop: '4px',
                  }}>
                    {card.info}
                  </p>
                )}
              </div>
              <card.icon size={18} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Events row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ marginBottom: '32px' }}>
        {/* Chart */}
        <div className="lg:col-span-2" style={{
          background: nd.surface,
          border: `1px solid ${nd.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: nd.textSecondary,
              textTransform: 'uppercase',
            }}>
              INGRESOS VS EGRESOS
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: nd.textDisabled,
              letterSpacing: '0.06em',
            }}>
              6 MESES
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.monthly}>
              <CartesianGrid stroke={nd.border} horizontal={true} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: "'Space Mono', monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: "'Space Mono', monospace" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: nd.surfaceRaised,
                  border: `1px solid ${nd.borderVisible}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: "'Space Mono', monospace",
                  color: nd.textPrimary,
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Line type="monotone" dataKey="ingresos" stroke={nd.success} strokeWidth={2} dot={false} name="Ingresos" />
              <Line type="monotone" dataKey="egresos" stroke={nd.error} strokeWidth={2} dot={false} name="Egresos" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px]" style={{ background: nd.success }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>INGRESOS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px]" style={{ background: nd.error }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>EGRESOS</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{
          background: nd.surface,
          border: `1px solid ${nd.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: nd.textSecondary,
              textTransform: 'uppercase',
            }}>
              PROXIMOS EVENTOS
            </span>
            <button
              onClick={() => navigate('/eventos')}
              className="cursor-pointer flex items-center gap-1"
              style={{ color: nd.textDisabled, fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}
            >
              VER <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </div>
          <div className="space-y-0">
            {upcomingEvents.map((event, i) => {
              const d = new Date(event.date);
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-4 py-3 cursor-pointer"
                  style={{ borderBottom: i < upcomingEvents.length - 1 ? `1px solid ${nd.border}` : 'none' }}
                >
                  <div className="text-center shrink-0" style={{ width: '40px' }}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '24px',
                      fontWeight: 700,
                      color: nd.textDisplay,
                      lineHeight: 1,
                    }}>
                      {d.getDate()}
                    </div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: nd.textDisabled,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {d.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '13px', color: nd.textPrimary }}>{event.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1" style={{ fontSize: '10px', color: nd.textDisabled }}>
                        <MapPin size={10} strokeWidth={1.5} /> {event.location}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    color: nd.textSecondary,
                    letterSpacing: '0.04em',
                  }}>
                    {event.registered}/{event.capacity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions + Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <div style={{
          background: nd.surface,
          border: `1px solid ${nd.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: nd.textSecondary,
              textTransform: 'uppercase',
            }}>
              TRANSACCIONES RECIENTES
            </span>
            <button
              onClick={() => navigate('/transacciones')}
              className="cursor-pointer flex items-center gap-1"
              style={{ color: nd.textDisabled, fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}
            >
              VER <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </div>
          <div>
            {recentTransactions.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < recentTransactions.length - 1 ? `1px solid ${nd.border}` : 'none' }}
              >
                <div className="flex items-center gap-3">
                  {t.type === 'ingreso'
                    ? <ArrowDownLeft size={14} strokeWidth={1.5} style={{ color: nd.success }} />
                    : <ArrowUpRight size={14} strokeWidth={1.5} style={{ color: nd.error }} />
                  }
                  <div>
                    <p style={{ fontSize: '13px', color: nd.textPrimary }}>{t.description}</p>
                    <p style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: nd.textDisabled,
                      letterSpacing: '0.04em',
                    }}>
                      {new Date(t.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: t.type === 'ingreso' ? nd.success : nd.error,
                }}>
                  {isHidden ? '$•••••' : `${t.type === 'ingreso' ? '+' : '-'}$${t.amount.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress — Segmented bars */}
        <div style={{
          background: nd.surface,
          border: `1px solid ${nd.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: nd.textSecondary,
              textTransform: 'uppercase',
            }}>
              PRESUPUESTOS
            </span>
            <button
              onClick={() => navigate('/presupuestos')}
              className="cursor-pointer flex items-center gap-1"
              style={{ color: nd.textDisabled, fontSize: '10px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}
            >
              VER <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </div>
          <div className="space-y-5">
            {budgets.slice(0, 4).map((b) => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              const barColor = pct > 90 ? nd.error : pct > 70 ? nd.warning : nd.success;
              const segments = 20;
              const filledSegments = Math.round((pct / 100) * segments);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: nd.textPrimary }}>{b.name}</span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 700,
                      color: barColor,
                    }}>
                      {pct}%
                    </span>
                  </div>
                  {/* Segmented progress bar */}
                  <div className="flex gap-[2px]">
                    {Array.from({ length: segments }).map((_, idx) => (
                      <div
                        key={`seg-${b.id}-${idx}`}
                        style={{
                          flex: 1,
                          height: '8px',
                          background: idx < filledSegments ? barColor : nd.border,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: nd.textDisabled,
                      letterSpacing: '0.04em',
                    }}>
                      {formatMoney(b.spent)}
                    </span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: nd.textDisabled,
                      letterSpacing: '0.04em',
                    }}>
                      {formatMoney(b.allocated)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
