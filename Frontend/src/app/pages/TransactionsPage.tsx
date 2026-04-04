import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Download, Plus, Eye, Pencil, Trash2, X,
  ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, Upload
} from 'lucide-react';
import { transactions, type Transaction } from '../data/mockData';
import { toast } from 'sonner';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};

const mono = "'Space Mono', monospace";
const grotesk = "'Space Grotesk', sans-serif";
const categories = ['Todas', 'Cuotas', 'Rifas', 'Eventos', 'Materiales', 'Servicios', 'Alimentos', 'Patrocinios', 'Equipamiento', 'Transporte', 'Impresion'];

export function TransactionsPage() {
  const [data, setData] = useState<Transaction[]>(transactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [catFilter, setCatFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<Transaction | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const { isHidden } = useFinancialPrivacy();
  const perPage = 8;

  const [formType, setFormType] = useState<'ingreso' | 'egreso'>('ingreso');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Cuotas');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPayment, setFormPayment] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta'>('Efectivo');
  const [formResponsible, setFormResponsible] = useState('Juan Perez');

  const closeModals = useCallback(() => {
    setModalOpen(false);
    setDetailModal(null);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModals(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeModals]);

  const filtered = useMemo(() => data.filter(t => {
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'todos' && t.type !== typeFilter) return false;
    if (catFilter !== 'Todas' && t.category !== catFilter) return false;
    if (statusFilter !== 'todos' && t.status !== statusFilter) return false;
    return true;
  }), [data, search, typeFilter, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openNew = () => {
    setEditingTx(null); setFormType('ingreso'); setFormAmount(''); setFormCategory('Cuotas');
    setFormDescription(''); setFormDate(new Date().toISOString().split('T')[0]);
    setFormPayment('Efectivo'); setFormResponsible('Juan Perez'); setModalOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx); setFormType(tx.type); setFormAmount(tx.amount.toString());
    setFormCategory(tx.category); setFormDescription(tx.description);
    setFormDate(tx.date); setFormPayment(tx.metodoPago); setFormResponsible(tx.responsible); setModalOpen(true);
  };

  const handleSave = () => {
    if (!formAmount || !formDescription) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    if (editingTx) {
      setData(prev => prev.map(t => t.id === editingTx.id ? {
        ...t, type: formType, amount: parseFloat(formAmount), category: formCategory,
        description: formDescription, date: formDate, metodoPago: formPayment, responsible: formResponsible,
      } : t));
      toast.success('[SAVED]');
    } else {
      const newTx: Transaction = {
        id: Date.now().toString(), date: formDate, type: formType, category: formCategory,
        description: formDescription, responsible: formResponsible, amount: parseFloat(formAmount), status: 'pendiente', metodoPago: formPayment,
      };
      setData(prev => [newTx, ...prev]);
      toast.success('[CREATED]');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(t => t.id !== id));
    setDetailModal(null);
    toast.success('[DELETED]');
  };

  const statusLabel = (s: string) => {
    const map: Record<string, { color: string; label: string }> = {
      pendiente: { color: nd.warning, label: 'PENDIENTE' },
      aprobado: { color: nd.success, label: 'APROBADO' },
      rechazado: { color: nd.error, label: 'RECHAZADO' },
    };
    const cfg = map[s] || map.pendiente;
    return (
      <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: cfg.color }}>
        [{cfg.label}]
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: mono, fontSize: '13px', color: nd.textPrimary,
    background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`,
    padding: '8px 0', width: '100%', outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    fontFamily: mono, fontSize: '12px', color: nd.textPrimary,
    background: nd.surface, border: `1px solid ${nd.borderVisible}`,
    borderRadius: '4px', padding: '8px 12px', cursor: 'pointer',
    appearance: 'none' as const,
  };

  return (
    <div style={{ fontFamily: grotesk }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Transacciones
          </h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
            GESTIONA INGRESOS Y EGRESOS
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 cursor-pointer transition-all duration-150 shrink-0"
          style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}
        >
          <Plus size={16} strokeWidth={1.5} /> NUEVA TX
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '24px' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: nd.textDisabled }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="BUSCAR..."
            className="w-full outline-none"
            style={{ ...inputStyle, paddingLeft: '24px' }}
          />
        </div>
        {[
          { val: typeFilter, set: (v: string) => { setTypeFilter(v); setPage(1); }, opts: [['todos', 'TIPO'], ['ingreso', 'INGRESO'], ['egreso', 'EGRESO']] },
          { val: statusFilter, set: (v: string) => { setStatusFilter(v); setPage(1); }, opts: [['todos', 'ESTADO'], ['pendiente', 'PEND'], ['aprobado', 'APROB'], ['rechazado', 'RECH']] },
        ].map((f, fi) => (
          <select key={fi} value={f.val} onChange={e => f.set(e.target.value)} style={selectStyle}>
            {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {(search || typeFilter !== 'todos' || statusFilter !== 'todos') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('todos'); setCatFilter('Todas'); setStatusFilter('todos'); setPage(1); }}
            className="cursor-pointer flex items-center gap-1"
            style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em' }}
          >
            <X size={12} strokeWidth={1.5} /> CLEAR
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${nd.borderVisible}` }}>
                {['FECHA', 'TIPO', 'CATEGORIA', 'DESCRIPCION', 'MONTO', 'ESTADO', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr
                  key={t.id}
                  className="cursor-pointer transition-colors duration-150"
                  style={{ borderBottom: `1px solid ${nd.border}` }}
                  onClick={() => setDetailModal(t)}
                  onMouseEnter={e => (e.currentTarget.style.background = nd.surfaceRaised)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3" style={{ fontFamily: mono, fontSize: '12px', color: nd.textDisabled }}>
                    {new Date(t.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1" style={{ fontFamily: mono, fontSize: '11px', color: t.type === 'ingreso' ? nd.success : nd.error }}>
                      {t.type === 'ingreso' ? <ArrowDownLeft size={12} strokeWidth={1.5} /> : <ArrowUpRight size={12} strokeWidth={1.5} />}
                      {t.type === 'ingreso' ? 'IN' : 'OUT'}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, letterSpacing: '0.04em' }}>
                    {t.category.toUpperCase()}
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: '13px', color: nd.textPrimary }}>{t.description}</td>
                  <td className="px-4 py-3 text-right" style={{ fontFamily: mono, fontSize: '14px', fontWeight: 700, color: t.type === 'ingreso' ? nd.success : nd.error }}>
                    {isHidden ? '$•••••' : `${t.type === 'ingreso' ? '+' : '-'}$${t.amount.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">{statusLabel(t.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setDetailModal(t)} className="p-1.5 cursor-pointer" style={{ color: nd.textDisabled }}><Eye size={14} strokeWidth={1.5} /></button>
                      <button onClick={() => openEdit(t)} className="p-1.5 cursor-pointer" style={{ color: nd.textDisabled }}><Pencil size={14} strokeWidth={1.5} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 cursor-pointer" style={{ color: nd.accent }}><Trash2 size={14} strokeWidth={1.5} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {paginated.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              style={{ borderBottom: i < paginated.length - 1 ? `1px solid ${nd.border}` : 'none' }}
              onClick={() => setDetailModal(t)}
            >
              <div className="flex items-center gap-3">
                {t.type === 'ingreso'
                  ? <ArrowDownLeft size={14} strokeWidth={1.5} style={{ color: nd.success }} />
                  : <ArrowUpRight size={14} strokeWidth={1.5} style={{ color: nd.error }} />
                }
                <div>
                  <p style={{ fontSize: '13px', color: nd.textPrimary }}>{t.description}</p>
                  <p style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.04em' }}>
                    {t.category.toUpperCase()} · {new Date(t.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: mono, fontSize: '14px', fontWeight: 700, color: t.type === 'ingreso' ? nd.success : nd.error }}>
                  {isHidden ? '$•••••' : `${t.type === 'ingreso' ? '+' : '-'}$${t.amount.toLocaleString()}`}
                </p>
                {statusLabel(t.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${nd.border}` }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em' }}>
              {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} / {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 cursor-pointer disabled:opacity-30" style={{ color: nd.textSecondary }}>
                <ChevronLeft size={14} strokeWidth={1.5} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-7 h-7 flex items-center justify-center cursor-pointer"
                  style={{
                    fontFamily: mono, fontSize: '11px',
                    color: p === page ? nd.textDisplay : nd.textDisabled,
                    border: p === page ? `1px solid ${nd.textDisplay}` : 'none',
                    borderRadius: '4px',
                  }}
                >{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 cursor-pointer disabled:opacity-30" style={{ color: nd.textSecondary }}>
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto"
            style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px', padding: '32px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
                {editingTx ? 'EDITAR TRANSACCION' : 'NUEVA TRANSACCION'}
              </span>
              <button onClick={() => setModalOpen(false)} className="cursor-pointer" style={{ color: nd.textDisabled }}>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Type segmented control */}
            <div className="flex" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', marginBottom: '24px' }}>
              {(['ingreso', 'egreso'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className="flex-1 h-10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                  style={{
                    fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em',
                    borderRadius: '999px',
                    background: formType === type ? nd.textDisplay : 'transparent',
                    color: formType === type ? nd.black : nd.textSecondary,
                  }}
                >
                  {type === 'ingreso' ? <ArrowDownLeft size={14} strokeWidth={1.5} /> : <ArrowUpRight size={14} strokeWidth={1.5} />}
                  {type === 'ingreso' ? 'INGRESO' : 'EGRESO'}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>MONTO</label>
                <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>DESCRIPCION</label>
                <input value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Describe el movimiento..." style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>CATEGORIA</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                    {categories.filter(c => c !== 'Todas').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>FECHA</label>
                  <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} style={{ ...selectStyle, width: '100%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>METODO</label>
                  <select value={formPayment} onChange={e => setFormPayment(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                    <option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>RESPONSABLE</label>
                  <select value={formResponsible} onChange={e => setFormResponsible(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                    <option>Juan Perez</option><option>Maria Garcia</option><option>Carlos Lopez</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3" style={{ marginTop: '32px' }}>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-11 cursor-pointer transition-colors duration-150"
                style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textSecondary, background: 'transparent' }}
              >
                CANCELAR
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-11 cursor-pointer transition-all duration-150"
                style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em' }}
              >
                {editingTx ? 'ACTUALIZAR' : 'GUARDAR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setDetailModal(null)}>
          <div
            className="w-full max-w-[420px]"
            style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px', padding: '32px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
                DETALLE
              </span>
              <button onClick={() => setDetailModal(null)} className="cursor-pointer" style={{ color: nd.textDisabled }}>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: detailModal.type === 'ingreso' ? nd.success : nd.error }}>
                [{detailModal.type === 'ingreso' ? 'INGRESO' : 'EGRESO'}]
              </span>
              {statusLabel(detailModal.status)}
            </div>

            <p style={{ fontFamily: mono, fontSize: '36px', fontWeight: 700, color: detailModal.type === 'ingreso' ? nd.success : nd.error, lineHeight: 1, marginBottom: '24px' }}>
              {isHidden ? '$•••••' : `${detailModal.type === 'ingreso' ? '+' : '-'}$${detailModal.amount.toLocaleString()}`}
            </p>

            <div>
              {[
                ['DESCRIPCION', detailModal.description],
                ['CATEGORIA', detailModal.category],
                ['FECHA', new Date(detailModal.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['METODO', detailModal.metodoPago],
                ['RESPONSABLE', detailModal.responsible],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-3" style={{ borderBottom: `1px solid ${nd.border}` }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{label}</span>
                  <span style={{ fontSize: '13px', color: nd.textPrimary }}>{val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3" style={{ marginTop: '24px' }}>
              <button
                onClick={() => { setDetailModal(null); openEdit(detailModal); }}
                className="flex-1 h-10 cursor-pointer"
                style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.textSecondary, background: 'transparent' }}
              >
                EDITAR
              </button>
              <button
                onClick={() => handleDelete(detailModal.id)}
                className="flex-1 h-10 cursor-pointer"
                style={{ border: `1px solid ${nd.accent}`, borderRadius: '999px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.accent, background: 'transparent' }}
              >
                ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
