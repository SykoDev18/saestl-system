import { useState, useMemo, useCallback, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cuentas as initialCuentas, type Cuenta } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";

const statusMap: Record<string, { color: string; label: string }> = {
  pendiente: { color: nd.warning, label: 'PENDIENTE' },
  pagado: { color: nd.success, label: 'PAGADO' },
  vencido: { color: nd.error, label: 'VENCIDO' },
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState(initialCuentas);
  const [filter, setFilter] = useState('todos');
  const [createModal, setCreateModal] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const { formatMoney } = useFinancialPrivacy();

  const filtered = useMemo(() => filter === 'todos' ? accounts : accounts.filter(a => a.status === filter), [accounts, filter]);
  const totalPending = accounts.filter(a => a.status === 'pendiente').reduce((a, c) => a + c.amount, 0);
  const totalOverdue = accounts.filter(a => a.status === 'vencido').reduce((a, c) => a + c.amount, 0);

  const closeModals = useCallback(() => setCreateModal(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModals(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeModals]);

  const markPaid = (id: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'pagado' as const } : a));
    toast.success('[PAID]');
  };

  const openCreate = () => {
    setNewDesc(''); setNewAmount(''); setNewDueDate(''); setNewSupplier(''); setNewCategory('');
    setCreateModal(true);
  };

  const handleCreate = () => {
    if (!newDesc || !newAmount || !newDueDate || !newSupplier || !newCategory) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    const newCuenta: Cuenta = {
      id: Date.now().toString(), description: newDesc, amount: parseFloat(newAmount),
      dueDate: newDueDate, status: 'pendiente', supplier: newSupplier, category: newCategory,
    };
    setAccounts(prev => [newCuenta, ...prev]);
    setCreateModal(false);
    toast.success('[CREATED]');
  };

  const inputStyle: React.CSSProperties = { fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`, padding: '8px 0', width: '100%', outline: 'none' };

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
        <button onClick={openCreate} className="flex items-center gap-2 cursor-pointer shrink-0"
          style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}>
          <Plus size={16} strokeWidth={1.5} /> NUEVA
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'PENDIENTE', value: formatMoney(totalPending), color: nd.warning },
          { label: 'VENCIDO', value: formatMoney(totalOverdue), color: nd.error },
          { label: 'TOTAL', value: accounts.length.toString(), color: nd.textSecondary },
        ].map(s => (
          <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
            <p style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '8px' }}>
              {s.value}
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
                  {formatMoney(account.amount)}
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

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setCreateModal(false)}>
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto" style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>NUEVA CUENTA</span>
              <button onClick={() => setCreateModal(false)} className="cursor-pointer" style={{ color: nd.textDisabled }}><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="space-y-5">
              <div><label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>DESCRIPCION</label><input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Ej: Renta de sonido" style={inputStyle} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>PROVEEDOR</label><input value={newSupplier} onChange={e => setNewSupplier(e.target.value)} placeholder="Ej: Audio Pro MX" style={inputStyle} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>MONTO</label><input value={newAmount} onChange={e => setNewAmount(e.target.value)} type="number" placeholder="0" style={inputStyle} /></div>
                <div><label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>CATEGORIA</label><input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Servicios" style={inputStyle} /></div>
              </div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>FECHA LIMITE</label><input value={newDueDate} onChange={e => setNewDueDate(e.target.value)} type="date" style={inputStyle} /></div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setCreateModal(false)} className="flex-1 h-11 cursor-pointer" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', color: nd.textSecondary, background: 'transparent' }}>CANCELAR</button>
              <button onClick={handleCreate} className="flex-1 h-11 cursor-pointer" style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px' }}>CREAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
