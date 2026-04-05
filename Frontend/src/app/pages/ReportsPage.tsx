import { useMemo, useState, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, FileText, FileDown, File } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Cuenta, Rifa, Transaction } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';
import { toast } from 'sonner';
import { transactionService } from '../services/transactionService';
import { rifaService } from '../services/rifaService';
import { cuentaService } from '../services/cuentaService';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

const tooltipStyle = {
  background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`,
  borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary,
};

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function monthKey(dateValue: string) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function buildMonthlyData(transactions: Transaction[], rifas: Rifa[]) {
  const now = new Date();
  const months: Array<{ key: string; month: string; ingresos: number; egresos: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''),
      ingresos: 0,
      egresos: 0,
    });
  }

  const byMonth = new Map(months.map((m) => [m.key, m]));

  transactions
    .filter((t) => t.status !== 'rechazado')
    .forEach((t) => {
      const item = byMonth.get(monthKey(t.date));
      if (!item) return;
      if (t.type === 'ingreso') item.ingresos += t.amount;
      else item.egresos += t.amount;
    });

  rifas
    .filter((r) => r.status === 'cerrada' || r.status === 'sorteada')
    .forEach((r) => {
      const closeDate = r.drawDate || r.endDate;
      if (!closeDate) return;
      const item = byMonth.get(monthKey(closeDate));
      if (!item) return;
      item.ingresos += r.soldTickets * r.pricePerTicket;
    });

  return months;
}

function toCsvValue(value: string | number) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function ReportsPage() {
  const { formatMoney } = useFinancialPrivacy();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportsData = async () => {
      setLoading(true);
      const [txRes, rifaRes, cuentaRes] = await Promise.allSettled([
        transactionService.list(),
        rifaService.list(),
        cuentaService.list(),
      ]);

      if (txRes.status === 'fulfilled') setTransactions(txRes.value);
      else toast.error('No se pudieron cargar transacciones');

      if (rifaRes.status === 'fulfilled') setRifas(rifaRes.value);
      else toast.error('No se pudieron cargar rifas');

      if (cuentaRes.status === 'fulfilled') setCuentas(cuentaRes.value);
      else toast.error('No se pudieron cargar cuentas');

      setLoading(false);
    };

    loadReportsData();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const validTransactions = useMemo(
    () => transactions.filter((t) => t.status !== 'rechazado'),
    [transactions],
  );

  const closedRifas = useMemo(
    () => rifas.filter((r) => r.status === 'cerrada' || r.status === 'sorteada'),
    [rifas],
  );

  const pendingAccounts = useMemo(
    () => cuentas.filter((c) => c.status === 'pendiente' || c.status === 'vencido'),
    [cuentas],
  );

  const totalRifasClosedRevenue = useMemo(
    () => closedRifas.reduce((acc, r) => acc + (r.soldTickets * r.pricePerTicket), 0),
    [closedRifas],
  );

  const totalIngresos = useMemo(
    () => validTransactions.filter((t) => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0) + totalRifasClosedRevenue,
    [validTransactions, totalRifasClosedRevenue],
  );

  const totalEgresos = useMemo(
    () => validTransactions.filter((t) => t.type === 'egreso').reduce((a, t) => a + t.amount, 0),
    [validTransactions],
  );

  const totalCuentasPendientes = useMemo(
    () => pendingAccounts.reduce((a, c) => a + c.amount, 0),
    [pendingAccounts],
  );

  const monthlyData = useMemo(
    () => buildMonthlyData(validTransactions, rifas),
    [validTransactions, rifas],
  );

  const accumulatedBalanceData = useMemo(() => {
    let running = 0;
    return monthlyData.map((item) => {
      running += item.ingresos - item.egresos;
      return { month: item.month, balance: running };
    });
  }, [monthlyData]);

  const computedIncomeCategories = useMemo(() => {
    const map = new Map<string, number>();
    validTransactions
      .filter((t) => t.type === 'ingreso')
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));

    if (totalRifasClosedRevenue > 0) {
      map.set('Rifas cerradas', (map.get('Rifas cerradas') || 0) + totalRifasClosedRevenue);
    }

    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [validTransactions, totalRifasClosedRevenue]);

  const computedExpenseCategories = useMemo(() => {
    const map = new Map<string, number>();
    validTransactions
      .filter((t) => t.type === 'egreso')
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    pendingAccounts.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + c.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [validTransactions, pendingAccounts]);

  const exportCsv = () => {
    const lines: string[] = [];
    const now = new Date();

    lines.push('REPORTE FINANCIERO SAESTL');
    lines.push(`Generado,${toCsvValue(now.toLocaleString('es-MX'))}`);
    lines.push('');
    lines.push('RESUMEN');
    lines.push(`Ingresos,${toCsvValue(totalIngresos)}`);
    lines.push(`Egresos,${toCsvValue(totalEgresos)}`);
    lines.push(`Cuentas por pagar,${toCsvValue(totalCuentasPendientes)}`);
    lines.push(`Balance,${toCsvValue(totalIngresos - totalEgresos - totalCuentasPendientes)}`);
    lines.push('');

    lines.push('TRANSACCIONES');
    lines.push(['ID', 'Fecha', 'Tipo', 'Categoria', 'Descripcion', 'Responsable', 'Monto', 'Estado', 'MetodoPago'].join(','));
    validTransactions.forEach((t) => {
      lines.push([
        toCsvValue(t.id),
        toCsvValue(t.date),
        toCsvValue(t.type),
        toCsvValue(t.category),
        toCsvValue(t.description),
        toCsvValue(t.responsible),
        toCsvValue(t.amount),
        toCsvValue(t.status),
        toCsvValue(t.metodoPago),
      ].join(','));
    });

    if (closedRifas.length > 0) {
      lines.push('');
      lines.push('RIFAS CERRADAS');
      lines.push(['ID', 'Nombre', 'Estado', 'BoletosVendidos', 'PrecioBoleto', 'IngresoCalculado'].join(','));
      closedRifas.forEach((r) => {
        lines.push([
          toCsvValue(r.id),
          toCsvValue(r.name),
          toCsvValue(r.status),
          toCsvValue(r.soldTickets),
          toCsvValue(r.pricePerTicket),
          toCsvValue(r.soldTickets * r.pricePerTicket),
        ].join(','));
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_financiero_${now.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('[EXPORTED: CSV]');
  };

  const exportPdf = () => {
    const now = new Date();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    doc.setFontSize(14);
    doc.text('Reporte Financiero SAESTL', 40, 40);
    doc.setFontSize(10);
    doc.text(`Generado: ${now.toLocaleString('es-MX')}`, 40, 58);

    const summaryRows = [
      ['Ingresos', formatCurrency(totalIngresos)],
      ['Egresos', formatCurrency(totalEgresos)],
      ['Cuentas por pagar', formatCurrency(totalCuentasPendientes)],
      ['Balance', formatCurrency(totalIngresos - totalEgresos - totalCuentasPendientes)],
      ['Tx totales', String(validTransactions.length)],
    ];

    autoTable(doc, {
      startY: 72,
      head: [['Indicador', 'Valor']],
      body: summaryRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [17, 17, 17] },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 18,
      head: [['Fecha', 'Tipo', 'Categoria', 'Descripcion', 'Monto', 'Estado']],
      body: validTransactions.map((t) => [
        t.date,
        t.type,
        t.category,
        t.description,
        formatCurrency(t.amount),
        t.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [17, 17, 17] },
    });

    if (closedRifas.length > 0) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 18,
        head: [['Rifa', 'Estado', 'Boletos vendidos', 'Precio boleto', 'Ingreso']],
        body: closedRifas.map((r) => [
          r.name,
          r.status,
          String(r.soldTickets),
          formatCurrency(r.pricePerTicket),
          formatCurrency(r.soldTickets * r.pricePerTicket),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [17, 17, 17] },
      });
    }

    doc.save(`reporte_financiero_${now.toISOString().slice(0, 10)}.pdf`);
    toast.success('[EXPORTED: PDF]');
  };

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
        <div ref={exportRef} className="relative">
          <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 cursor-pointer shrink-0 transition-colors duration-150"
            style={{ height: '44px', padding: '0 24px', border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary, background: 'transparent' }}>
            <Download size={14} strokeWidth={1.5} /> EXPORTAR
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-12 w-48 py-1 overflow-hidden" style={{ background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', zIndex: 10 }}>
              {[
                { label: 'CSV', ext: '.csv', icon: FileDown, onClick: exportCsv },
                { label: 'PDF', ext: '.pdf', icon: File, onClick: exportPdf },
              ].map(item => (
                <button key={item.label} onClick={() => { setExportOpen(false); item.onClick(); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer transition-colors duration-150 hover:bg-[#111]"
                  style={{ color: nd.textSecondary }}>
                  <div className="flex items-center gap-3">
                    <item.icon size={14} strokeWidth={1.5} />
                    <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em' }}>{item.label}</span>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{item.ext}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'INGRESOS', value: formatMoney(totalIngresos), color: nd.success, icon: TrendingUp },
          { label: 'EGRESOS', value: formatMoney(totalEgresos + totalCuentasPendientes), color: nd.error, icon: TrendingDown },
          { label: 'BALANCE', value: formatMoney(totalIngresos - totalEgresos - totalCuentasPendientes), color: nd.textDisplay, icon: DollarSign },
          { label: 'TX TOTAL', value: validTransactions.length.toString(), color: nd.textSecondary, icon: FileText },
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
            <LineChart data={monthlyData}>
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
              <Pie data={computedIncomeCategories} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value" strokeWidth={0}>
                {computedIncomeCategories.map((entry) => (
                  <Cell key={`cat-${entry.name}`} fill={nd.textDisplay} fillOpacity={0.15 + (0.85 * entry.value / Math.max(...computedIncomeCategories.map(c => c.value), 1))} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {computedIncomeCategories.map((d) => (
              <span key={d.name} style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.04em' }}>
                {d.name.toUpperCase()} {Math.round(d.value / Math.max(computedIncomeCategories.reduce((a, c) => a + c.value, 0), 1) * 100)}%
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
            <LineChart data={accumulatedBalanceData}>
              <CartesianGrid stroke={nd.border} horizontal vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="balance" stroke={nd.accent} strokeWidth={2} dot={false} name="Balance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: '16px', fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>
          [CARGANDO DATOS DE REPORTE]
        </div>
      )}
    </div>
  );
}
