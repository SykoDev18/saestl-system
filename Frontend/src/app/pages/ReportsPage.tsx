import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { chartData, transactions } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

const expenseCategories = [
  { name: 'Materiales', value: 850 },
  { name: 'Servicios', value: 3000 },
  { name: 'Alimentos', value: 1200 },
  { name: 'Equipamiento', value: 1500 },
  { name: 'Transporte', value: 2800 },
  { name: 'Impresion', value: 450 },
];

const tooltipStyle = {
  background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`,
  borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary,
};

export function ReportsPage() {
  const { formatMoney } = useFinancialPrivacy();
  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0);
  const totalEgresos = transactions.filter(t => t.type === 'egreso').reduce((a, t) => a + t.amount, 0);

  const computedExpenseCategories = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === 'egreso').forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, []);

  const card = (bg: string, border: string, radius: string, padding: string, mb: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${border}`, borderRadius: radius, padding, marginBottom: mb,
  });

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Reportes
          </h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
            ANALISIS FINANCIERO
          </p>
        </div>
        <button className="flex items-center gap-2 cursor-pointer shrink-0 transition-colors duration-150"
          style={{ height: '44px', padding: '0 24px', border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary, background: 'transparent' }}>
          <Download size={14} strokeWidth={1.5} /> EXPORTAR
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'INGRESOS', value: formatMoney(totalIngresos), color: nd.success, icon: TrendingUp },
          { label: 'EGRESOS', value: formatMoney(totalEgresos), color: nd.error, icon: TrendingDown },
          { label: 'BALANCE', value: formatMoney(totalIngresos - totalEgresos), color: nd.textDisplay, icon: DollarSign },
          { label: 'TX TOTAL', value: transactions.length.toString(), color: nd.textSecondary, icon: FileText },
        ].map(s => (
          <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
                <p style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '8px' }}>
                  {s.value}
                </p>
              </div>
              <s.icon size={16} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
        {/* Trend */}
        <div style={card(nd.surface, nd.border, '12px', '20px', '0')}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
            TENDENCIA MENSUAL
          </span>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.monthly}>
              <CartesianGrid stroke={nd.border} horizontal vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="ingresos" stroke={nd.success} strokeWidth={2} dot={false} name="Ingresos" />
              <Line type="monotone" dataKey="egresos" stroke={nd.error} strokeWidth={2} dot={false} name="Egresos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div style={card(nd.surface, nd.border, '12px', '20px', '0')}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
            DISTRIBUCION INGRESOS
          </span>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData.categories} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" strokeWidth={0}>
                {chartData.categories.map((entry) => (
                  <Cell key={`cat-${entry.name}`} fill={nd.textDisplay} fillOpacity={0.15 + (0.85 * entry.value / Math.max(...chartData.categories.map(c => c.value)))} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {chartData.categories.map((d, i) => (
              <span key={d.name} style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.04em' }}>
                {d.name.toUpperCase()} {Math.round(d.value / chartData.categories.reduce((a, c) => a + c.value, 0) * 100)}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expenses by category */}
        <div style={card(nd.surface, nd.border, '12px', '20px', '0')}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
            EGRESOS POR CATEGORIA
          </span>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={computedExpenseCategories}>
              <CartesianGrid stroke={nd.border} horizontal vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="value" fill={nd.textDisplay} name="Monto" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Balance */}
        <div style={card(nd.surface, nd.border, '12px', '20px', '0')}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
            BALANCE ACUMULADO
          </span>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.monthly.map((d, i, arr) => ({
              month: d.month,
              balance: arr.slice(0, i + 1).reduce((a, m) => a + m.ingresos - m.egresos, 0),
            }))}>
              <CartesianGrid stroke={nd.border} horizontal vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="balance" stroke={nd.accent} strokeWidth={2} dot={false} name="Balance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
