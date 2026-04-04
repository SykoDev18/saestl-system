import { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

interface Account {
  id: string; description: string; amount: number; dueDate: string;
  status: 'pendiente' | 'pagado' | 'vencido'; supplier: string; category: string;
}

const initialAccounts: Account[] = [
  { id: '1', description: 'Renta de sonido para evento', amount: 3500, dueDate: '2026-03-25', status: 'pendiente', supplier: 'Audio Pro MX', category: 'Servicios' },
  { id: '2', description: 'Impresion de playeras', amount: 4800, dueDate: '2026-03-20', status: 'pendiente', supplier: 'Imprenta Express', category: 'Materiales' },
  { id: '3', description: 'Catering fiesta bienvenida', amount: 6000, dueDate: '2026-02-28', status: 'pagado', supplier: 'Banquetes Diana', category: 'Alimentos' },
  { id: '4', description: 'Diseno de imagen semestral', amount: 1500, dueDate: '2026-03-10', status: 'vencido', supplier: 'Freelancer Design', category: 'Servicios' },
  { id: '5', description: 'Trofeos torneo deportivo', amount: 2200, dueDate: '2026-03-30', status: 'pendiente', supplier: 'Trofeos y Medallas', category: 'Materiales' },
];

const statusMap: Record<string, { color: string; label: string }> = {
  pendiente: { color: nd.warning, label: 'PENDIENTE' },
  pagado: { color: nd.success, label: 'PAGADO' },
  vencido: { color: nd.error, label: 'VENCIDO' },
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [filter, setFilter] = useState('todos');
  const { isHidden } = useFinancialPrivacy();

  const filtered = filter === 'todos' ? accounts : accounts.filter(a => a.status === filter);
  const totalPending = accounts.filter(a => a.status === 'pendiente').reduce((a, c) => a + c.amount, 0);
  const totalOverdue = accounts.filter(a => a.status === 'vencido').reduce((a, c) => a + c.amount, 0);

  const markPaid = (id: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'pagado' as const } : a));
    toast.success('[PAID]');
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Cuentas
          </h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
            PAGOS PENDIENTES Y PROVEEDORES
          </p>
        </div>
        <button className="flex items-center gap-2 cursor-pointer shrink-0"
          style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}>
          <Plus size={16} strokeWidth={1.5} /> NUEVA
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'PENDIENTE', value: `$${totalPending.toLocaleString()}`, color: nd.warning },
          { label: 'VENCIDO', value: `$${totalOverdue.toLocaleString()}`, color: nd.error },
          { label: 'TOTAL', value: accounts.length.toString(), color: nd.textSecondary },
        ].map(s => (
          <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
            <p style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '8px' }}>
              {s.label !== 'TOTAL' && isHidden ? '$•••••' : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Segmented filter */}
      <div className="flex" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', marginBottom: '24px', maxWidth: '400px' }}>
        {[
          { key: 'todos', label: 'TODOS' },
          { key: 'pendiente', label: 'PEND' },
          { key: 'vencido', label: 'VENC' },
          { key: 'pagado', label: 'PAGADO' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex-1 h-9 cursor-pointer transition-all duration-150"
            style={{
              fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', borderRadius: '999px',
              background: filter === f.key ? nd.textDisplay : 'transparent',
              color: filter === f.key ? nd.black : nd.textSecondary,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
        {filtered.map((account, i) => {
          const st = statusMap[account.status];
          return (
            <div
              key={account.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4"
              style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${nd.border}` : 'none' }}
            >
              <div>
                <p style={{ fontSize: '14px', color: nd.textPrimary }}>{account.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em' }}>
                    {account.supplier.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.04em' }}>
                    {new Date(account.dueDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span style={{ fontFamily: mono, fontSize: '16px', fontWeight: 700, color: nd.textPrimary }}>
                  {isHidden ? '$•••••' : `$${account.amount.toLocaleString()}`}
                </span>
                <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: st.color }}>
                  [{st.label}]
                </span>
                {account.status !== 'pagado' && (
                  <button
                    onClick={() => markPaid(account.id)}
                    className="cursor-pointer transition-colors duration-150"
                    style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.success, border: `1px solid ${nd.success}`, borderRadius: '999px', padding: '4px 12px' }}
                  >
                    PAGAR
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
