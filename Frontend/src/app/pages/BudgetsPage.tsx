import { useEffect, useMemo, useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { type Budget, type Cuenta, type Transaction, budgets as fallbackBudgets } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';
import { transactionService } from '../services/transactionService';
import { cuentaService } from '../services/cuentaService';
import { api } from '../api/client';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

export function BudgetsPage() {
  const { formatMoney } = useFinancialPrivacy();
  const [budgets, setBudgets] = useState<Budget[]>(fallbackBudgets);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgetData = async () => {
      setLoading(true);
      const [budgetRes, txRes, accountRes] = await Promise.allSettled([
        api.get<Budget[]>('/presupuestos'),
        transactionService.list(),
        cuentaService.list(),
      ]);

      if (budgetRes.status === 'fulfilled' && budgetRes.value.length > 0) {
        setBudgets(budgetRes.value);
      } else {
        setBudgets(fallbackBudgets);
      }

      if (txRes.status === 'fulfilled') setTransactions(txRes.value);
      else toast.error('No se pudieron cargar transacciones');

      if (accountRes.status === 'fulfilled') setAccounts(accountRes.value);
      else toast.error('No se pudieron cargar cuentas');

      setLoading(false);
    };

    loadBudgetData();
  }, []);

  const budgetRows = useMemo(() => {
    const expenseByCategory = new Map<string, number>();
    transactions
      .filter((t) => t.status !== 'rechazado' && t.type === 'egreso')
      .forEach((t) => expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount));

    accounts
      .filter((account) => account.status === 'pendiente' || account.status === 'vencido')
      .forEach((account) => expenseByCategory.set(account.category, (expenseByCategory.get(account.category) || 0) + account.amount));

    return budgets.map((budget) => {
      const spent = expenseByCategory.get(budget.category) || budget.spent;
      const allocated = budget.allocated;
      const remaining = allocated - spent;
      const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
      return {
        ...budget,
        spent,
        remaining,
        pct,
      };
    });
  }, [budgets, transactions, accounts]);

  const totalAllocated = budgetRows.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = budgetRows.reduce((a, b) => a + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const totalPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const barData = budgetRows.map(b => ({
    name: b.name.length > 10 ? b.name.substring(0, 10) + '..' : b.name,
    asignado: b.allocated,
    gastado: b.spent,
  }));

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Presupuestos
        </h1>
        <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
          CONTROL Y SEGUIMIENTO
        </p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '32px' }}>
          {[
          { label: 'TOTAL ASIGNADO', value: formatMoney(totalAllocated), color: nd.textDisplay },
          { label: 'TOTAL GASTADO', value: formatMoney(totalSpent), color: nd.error },
          { label: 'DISPONIBLE', value: formatMoney(totalRemaining), color: nd.success },
        ].map(s => (
          <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
            <p style={{ fontFamily: mono, fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '8px' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Overall progress - segmented */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>EJECUCION TOTAL</span>
          <span style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: totalPct > 90 ? nd.error : totalPct > 70 ? nd.warning : nd.success }}>
            {totalPct}%
          </span>
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={`total-seg-${i}`} style={{
              flex: 1, height: '16px',
              background: i < Math.round((totalPct / 100) * 30)
                ? (totalPct > 90 ? nd.error : totalPct > 70 ? nd.warning : nd.textDisplay)
                : nd.border,
            }} />
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
          ASIGNADO VS GASTADO
        </span>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid stroke={nd.border} horizontal={false} vertical={true} />
            <XAxis type="number" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} tickFormatter={v => `$${v / 1000}k`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: nd.textSecondary, fontFamily: mono }} width={90} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number) => `$${v.toLocaleString()}`}
              contentStyle={{ background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary }}
            />
            <Bar dataKey="asignado" fill={nd.border} name="Asignado" />
            <Bar dataKey="gastado" fill={nd.textDisplay} name="Gastado" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px]" style={{ background: nd.border }} />
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>ASIGNADO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px]" style={{ background: nd.textDisplay }} />
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>GASTADO</span>
          </div>
        </div>
      </div>

      {/* Budget Details */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
          DETALLE POR PARTIDA
        </span>
        <div>
          {loading && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, padding: '8px 0' }}>
              [CARGANDO PRESUPUESTOS]
            </div>
          )}
          {!loading && budgetRows.length === 0 && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, padding: '8px 0' }}>
              [SIN PRESUPUESTOS]
            </div>
          )}
          {budgetRows.map((b, i) => {
            const pct = b.pct;
            const barColor = pct > 90 ? nd.error : pct > 70 ? nd.warning : nd.success;
            const remaining = b.remaining;
            const segments = 20;
            const filled = Math.round((pct / 100) * segments);
            return (
              <div key={b.id} className="py-4" style={{ borderBottom: i < budgets.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: nd.textPrimary }}>{b.name}</p>
                    <p style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em', marginTop: '2px' }}>
                      {b.category.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: mono, fontSize: '14px', fontWeight: 700, color: barColor }}>
                      {pct}%
                    </span>
                    {pct > 90 && <AlertTriangle size={14} strokeWidth={1.5} style={{ color: nd.error }} />}
                    {pct < 50 && <CheckCircle size={14} strokeWidth={1.5} style={{ color: nd.success }} />}
                  </div>
                </div>
                <div className="flex gap-[2px]" style={{ marginBottom: '6px' }}>
                  {Array.from({ length: segments }).map((_, idx) => (
                    <div key={`seg-${b.id}-${idx}`} style={{ flex: 1, height: '8px', background: idx < filled ? barColor : nd.border }} />
                  ))}
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.04em' }}>
                    GASTADO {formatMoney(b.spent)}
                  </span>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.04em' }}>
                    RESTANTE {formatMoney(remaining)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
