import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Wallet, AlertTriangle, CheckCircle, Plus, Pencil, Trash2, X, Copy,
  Download, FileDown, FileText, File, Search, ChevronUp, ChevronDown,
  ClipboardList, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { type Budget, type GastoRegistro, type Cuenta, type Transaction, budgets as fallbackBudgets } from '../data/mockData';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';
import { transactionService } from '../services/transactionService';
import { cuentaService } from '../services/cuentaService';
import { api } from '../api/client';

/* ─── Design tokens ─── */
const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921',
};
const mono = "'Space Mono', monospace";
const grotesk = "'Space Grotesk', sans-serif";

/* ─── Helpers ─── */
const getPctColor = (pct: number) => pct > 90 ? nd.error : pct > 70 ? nd.warning : nd.success;
const getBadge = (pct: number): { label: string; color: string } => {
  if (pct === 0) return { label: 'SALUDABLE', color: nd.success };
  if (pct <= 50) return { label: 'NORMAL', color: nd.textSecondary };
  if (pct <= 70) return { label: 'ALERTA', color: nd.warning };
  if (pct <= 100) return { label: 'CRÍTICO', color: nd.error };
  return { label: 'EXCEDIDO', color: nd.error };
};
const getDaysLeft = (mes: number, anio: number) => {
  const end = new Date(anio, mes, 0);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};
const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const categoryOptions = ['Eventos', 'Operación', 'Reserva', 'Servicios', 'Alimentos', 'Materiales', 'Transporte'];

export function BudgetsPage() {
  const { formatMoney, isHidden } = useFinancialPrivacy();

  /* ─── Data loading ─── */
  const [budgets, setBudgets] = useState<Budget[]>(fallbackBudgets);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [budgetRes, txRes, accountRes] = await Promise.allSettled([
        api.get<Budget[]>('/presupuestos'),
        transactionService.list(),
        cuentaService.list(),
      ]);
      if (budgetRes.status === 'fulfilled' && budgetRes.value.length > 0) setBudgets(budgetRes.value);
      else setBudgets(fallbackBudgets);
      if (txRes.status === 'fulfilled') setTransactions(txRes.value);
      if (accountRes.status === 'fulfilled') setAccounts(accountRes.value);
      setLoading(false);
    };
    load();
  }, []);

  /* ─── Filter / Sort / View state ─── */
  const now = new Date();
  const [mesFiltro, setMesFiltro] = useState(now.getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(now.getFullYear());
  const [sortBy, setSortBy] = useState<'pctDesc' | 'pctAsc' | 'nombre'>('pctDesc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'detail' | 'compact'>('detail');

  /* ─── Modals state ─── */
  const [createModal, setCreateModal] = useState(false);
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const [gastoModalId, setGastoModalId] = useState<string | null>(null);
  const [historialModalId, setHistorialModalId] = useState<string | null>(null);
  const [expandedHistorial, setExpandedHistorial] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* ─── Export dropdown ─── */
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ─── Create form ─── */
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Eventos');
  const [formAllocated, setFormAllocated] = useState('');
  const [formSpent, setFormSpent] = useState('');
  const [formRecurrente, setFormRecurrente] = useState(false);
  const [formMesesRecurrentes, setFormMesesRecurrentes] = useState(3);

  /* ─── Edit form ─── */
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAllocated, setEditAllocated] = useState('');

  /* ─── Gasto rápido form ─── */
  const [gastoMonto, setGastoMonto] = useState('');
  const [gastoDesc, setGastoDesc] = useState('');

  /* ─── Escape handler ─── */
  const closeAll = useCallback(() => {
    setCreateModal(false); setEditModalId(null); setGastoModalId(null); setHistorialModalId(null);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeAll]);

  /* ─── Computed: budget rows with enriched data ─── */
  const periodBudgets = useMemo(() => {
    return budgets.filter(b => b.mes === mesFiltro && b.anio === anioFiltro);
  }, [budgets, mesFiltro, anioFiltro]);

  const budgetRows = useMemo(() => {
    const expenseByCategory = new Map<string, number>();
    transactions
      .filter(t => t.status !== 'rechazado' && t.type === 'egreso')
      .forEach(t => expenseByCategory.set(t.category, (expenseByCategory.get(t.category) || 0) + t.amount));
    accounts
      .filter(a => a.status === 'pendiente' || a.status === 'vencido')
      .forEach(a => expenseByCategory.set(a.category, (expenseByCategory.get(a.category) || 0) + a.amount));

    return periodBudgets.map(budget => {
      const spent = budget.spent;
      const allocated = budget.allocated;
      const remaining = allocated - spent;
      const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
      return { ...budget, remaining, pct };
    });
  }, [periodBudgets, transactions, accounts]);

  /* ─── Sorted + searched ─── */
  const sortedBudgets = useMemo(() => {
    let arr = [...budgetRows];
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
    }
    // Sort
    if (sortBy === 'pctDesc') arr.sort((a, b) => b.pct - a.pct);
    else if (sortBy === 'pctAsc') arr.sort((a, b) => a.pct - b.pct);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [budgetRows, sortBy, searchQuery]);

  /* ─── Totals ─── */
  const totalAllocated = budgetRows.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = budgetRows.reduce((a, b) => a + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const totalPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const partidasEnRiesgo = budgetRows.filter(b => b.pct > 70).length;
  const partidasExcedidas = budgetRows.filter(b => b.pct > 100).length;

  /* ─── Mejora 5: Comparativa mes anterior ─── */
  const prevMonth = useMemo(() => {
    let pm = mesFiltro - 1, py = anioFiltro;
    if (pm === 0) { pm = 12; py--; }
    const prev = budgets.filter(b => b.mes === pm && b.anio === py);
    if (prev.length === 0) return null;
    const pAlloc = prev.reduce((a, b) => a + b.allocated, 0);
    const pSpent = prev.reduce((a, b) => a + b.spent, 0);
    return { mes: pm, anio: py, allocated: pAlloc, spent: pSpent, count: prev.length };
  }, [budgets, mesFiltro, anioFiltro]);

  const comparison = useMemo(() => {
    if (!prevMonth) return null;
    const allocDelta = prevMonth.allocated > 0 ? Math.round(((totalAllocated - prevMonth.allocated) / prevMonth.allocated) * 100) : 0;
    const spentDelta = prevMonth.spent > 0 ? Math.round(((totalSpent - prevMonth.spent) / prevMonth.spent) * 100) : 0;
    return { allocDelta, spentDelta, prevCount: prevMonth.count, currentCount: budgetRows.length, prevMes: prevMonth.mes };
  }, [prevMonth, totalAllocated, totalSpent, budgetRows.length]);

  /* ─── Chart data ─── */
  const barData = budgetRows.map(b => ({
    name: b.name.length > 10 ? b.name.substring(0, 10) + '..' : b.name,
    asignado: b.allocated,
    gastado: b.spent,
  }));

  /* ─── Handlers ─── */
  const handleCreate = () => {
    if (!formName.trim() || !formAllocated) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    const alloc = parseFloat(formAllocated);
    const spent = parseFloat(formSpent) || 0;
    if (alloc <= 0) { toast.error('[ERROR: MONTO INVÁLIDO]'); return; }

    const createOne = (m: number, y: number) => {
      const newB: Budget = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        name: formName.trim(), category: formCategory, allocated: alloc, spent, mes: m, anio: y, gastos: [],
      };
      return newB;
    };

    const newBudgets: Budget[] = [createOne(mesFiltro, anioFiltro)];
    if (formRecurrente) {
      for (let i = 1; i <= formMesesRecurrentes; i++) {
        let nm = mesFiltro + i, ny = anioFiltro;
        if (nm > 12) { nm -= 12; ny++; }
        newBudgets.push(createOne(nm, ny));
      }
    }
    setBudgets(prev => [...prev, ...newBudgets]);
    toast.success(formRecurrente ? `[${newBudgets.length} PRESUPUESTOS RECURRENTES CREADOS]` : '[PRESUPUESTO CREADO]');
    setCreateModal(false);
    setFormName(''); setFormAllocated(''); setFormSpent(''); setFormRecurrente(false); setFormMesesRecurrentes(3);
  };

  const openEdit = (b: Budget) => {
    setEditModalId(b.id); setEditName(b.name); setEditCategory(b.category); setEditAllocated(b.allocated.toString());
  };

  const handleEdit = () => {
    if (!editName.trim() || !editAllocated) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    setBudgets(prev => prev.map(b => b.id === editModalId ? { ...b, name: editName.trim(), category: editCategory, allocated: parseFloat(editAllocated) } : b));
    toast.success('[PRESUPUESTO ACTUALIZADO]');
    setEditModalId(null);
  };

  const openGasto = (id: string) => {
    setGastoModalId(id); setGastoMonto(''); setGastoDesc('');
  };

  const handleGasto = () => {
    if (!gastoMonto || !gastoDesc.trim()) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    const monto = parseFloat(gastoMonto);
    if (monto <= 0) { toast.error('[ERROR: MONTO INVÁLIDO]'); return; }
    const target = budgets.find(b => b.id === gastoModalId);
    if (!target) return;
    if (target.spent + monto > target.allocated && !gastoConfirm) { setGastoExcede(true); return; }
    const nuevoGasto: GastoRegistro = {
      id: Date.now().toString(), monto, descripcion: gastoDesc.trim(),
      fecha: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(),
    };
    setBudgets(prev => prev.map(b => b.id === gastoModalId
      ? { ...b, spent: b.spent + monto, gastos: [...b.gastos, nuevoGasto] } : b));
    toast.success(`[GASTO REGISTRADO: ${formatMoney(monto)}]`);
    setGastoModalId(null); setGastoExcede(false); setGastoConfirm(false);
  };
  const [gastoExcede, setGastoExcede] = useState(false);
  const [gastoConfirm, setGastoConfirm] = useState(false);

  const handleDelete = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast.success('[PRESUPUESTO ELIMINADO]');
    setDeleteConfirmId(null);
  };

  /* Mejora 2: Duplicar */
  const handleDuplicate = (b: Budget) => {
    const dup: Budget = {
      ...b, id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      name: `${b.name} (copia)`, spent: 0, gastos: [], mes: mesFiltro, anio: anioFiltro,
    };
    setBudgets(prev => [...prev, dup]);
    toast.success('[PARTIDA DUPLICADA]');
  };

  /* Mejora 8: Reorder */
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setBudgets(prev => {
      const ids = sortedBudgets.map(b => b.id);
      const arr = [...prev];
      const aIdx = arr.findIndex(b => b.id === ids[idx]);
      const bIdx = arr.findIndex(b => b.id === ids[idx - 1]);
      if (aIdx >= 0 && bIdx >= 0) [arr[aIdx], arr[bIdx]] = [arr[bIdx], arr[aIdx]];
      return arr;
    });
  };
  const handleMoveDown = (idx: number) => {
    if (idx >= sortedBudgets.length - 1) return;
    setBudgets(prev => {
      const ids = sortedBudgets.map(b => b.id);
      const arr = [...prev];
      const aIdx = arr.findIndex(b => b.id === ids[idx]);
      const bIdx = arr.findIndex(b => b.id === ids[idx + 1]);
      if (aIdx >= 0 && bIdx >= 0) [arr[aIdx], arr[bIdx]] = [arr[bIdx], arr[aIdx]];
      return arr;
    });
  };

  /* Mejora 1: Eliminar gasto individual */
  const handleDeleteGasto = (budgetId: string, gastoId: string) => {
    setBudgets(prev => prev.map(b => {
      if (b.id !== budgetId) return b;
      const gasto = b.gastos.find(g => g.id === gastoId);
      if (!gasto) return b;
      return { ...b, spent: Math.max(0, b.spent - gasto.monto), gastos: b.gastos.filter(g => g.id !== gastoId) };
    }));
    toast.success('[GASTO ELIMINADO]');
  };

  /* Mejora 3: Export CSV */
  const handleExportCSV = () => {
    const rows = [['Partida', 'Categoría', 'Asignado', 'Gastado', 'Restante', '% Ejecución']];
    budgetRows.forEach(b => rows.push([b.name, b.category, b.allocated.toString(), b.spent.toString(), b.remaining.toString(), `${b.pct}%`]));
    rows.push(['TOTALES', '', totalAllocated.toString(), totalSpent.toString(), totalRemaining.toString(), `${totalPct}%`]);
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `presupuestos_${mesFiltro}_${anioFiltro}.csv`; a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    toast.success('[EXPORTED: CSV]');
  };

  /* ─── Gasto preview ─── */
  const gastoTarget = gastoModalId ? budgets.find(b => b.id === gastoModalId) : null;
  const gastoMontoNum = parseFloat(gastoMonto) || 0;
  const gastoNewSpent = gastoTarget ? gastoTarget.spent + gastoMontoNum : 0;
  const gastoNewPct = gastoTarget && gastoTarget.allocated > 0 ? Math.round((gastoNewSpent / gastoTarget.allocated) * 100) : 0;
  const gastoWillExceed = gastoTarget ? gastoNewSpent > gastoTarget.allocated : false;

  /* ─── Mini donut data ─── */
  const getDonutData = (spent: number, allocated: number) => {
    const remaining = Math.max(0, allocated - spent);
    const excess = Math.max(0, spent - allocated);
    if (excess > 0) return [{ value: allocated, key: 'base' }, { value: excess, key: 'excess' }];
    return [{ value: spent, key: 'spent' }, { value: remaining, key: 'remaining' }];
  };

  /* ─── Quick suggest periods ─── */
  const suggestPeriods = useMemo(() => {
    const periods = new Set<string>();
    budgets.forEach(b => periods.add(`${b.mes}-${b.anio}`));
    return Array.from(periods).map(p => {
      const [m, y] = p.split('-').map(Number);
      return { mes: m, anio: y, label: `${monthNames[m - 1]} ${y}` };
    }).filter(p => !(p.mes === mesFiltro && p.anio === anioFiltro)).slice(0, 3);
  }, [budgets, mesFiltro, anioFiltro]);

  /* ─── Historial modal data ─── */
  const historialBudget = historialModalId ? budgets.find(b => b.id === historialModalId) : null;

  return (
    <div style={{ fontFamily: grotesk }}>
      {/* ═══ Mejora 7: Alert Banner ═══ */}
      {partidasExcedidas > 0 && (
        <div className="flex items-center gap-3 mb-4" style={{ background: 'rgba(215,25,33,0.1)', borderLeft: `3px solid ${nd.error}`, borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
          <AlertTriangle size={16} style={{ color: nd.error, flexShrink: 0 }} />
          <span style={{ fontFamily: mono, fontSize: '11px', color: nd.error, letterSpacing: '0.06em', flex: 1 }}>
            {partidasExcedidas} PARTIDA{partidasExcedidas > 1 ? 'S' : ''} HA{partidasExcedidas > 1 ? 'N' : ''} EXCEDIDO SU PRESUPUESTO
          </span>
        </div>
      )}
      {partidasExcedidas === 0 && totalPct > 90 && (
        <div className="flex items-center gap-3 mb-4" style={{ background: 'rgba(212,168,67,0.1)', borderLeft: `3px solid ${nd.warning}`, borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
          <AlertTriangle size={16} style={{ color: nd.warning, flexShrink: 0 }} />
          <span style={{ fontFamily: mono, fontSize: '11px', color: nd.warning, letterSpacing: '0.06em' }}>
            EJECUCIÓN GLOBAL AL {totalPct}% — PRESUPUESTO CASI AGOTADO
          </span>
        </div>
      )}

      {/* ═══ Title + Header Actions ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Presupuestos
          </h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
            CONTROL Y SEGUIMIENTO
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mejora 3: Export dropdown */}
          <div ref={exportRef} style={{ position: 'relative' }}>
            <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 cursor-pointer"
              style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '20px', padding: '8px 16px' }}>
              <Download size={14} /> EXPORTAR
            </button>
            {exportOpen && (
              <div style={{ position: 'absolute', right: 0, top: '44px', width: '192px', background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', zIndex: 60, overflow: 'hidden' }}>
                {[
                  { label: 'EXCEL (.XLSX)', icon: FileText, action: () => { setExportOpen(false); toast.info('[EXPORTANDO EXCEL...]'); } },
                  { label: 'CSV (.CSV)', icon: FileDown, action: handleExportCSV },
                  { label: 'PDF (.PDF)', icon: File, action: () => { setExportOpen(false); toast.info('[EXPORTANDO PDF...]'); } },
                ].map(opt => (
                  <button key={opt.label} onClick={opt.action} className="flex items-center gap-2 w-full cursor-pointer"
                    style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.textSecondary, padding: '10px 14px', background: 'transparent', border: 'none', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = nd.surface)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <opt.icon size={14} /> {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => { setFormName(''); setFormAllocated(''); setFormSpent(''); setFormCategory('Eventos'); setFormRecurrente(false); setCreateModal(true); }}
            className="flex items-center gap-2 cursor-pointer"
            style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textDisplay, background: nd.accent, border: 'none', borderRadius: '20px', padding: '8px 16px' }}>
            <Plus size={14} /> NUEVO
          </button>
        </div>
      </div>

      {/* ═══ Period Filter ═══ */}
      <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '24px' }}>
        <select value={mesFiltro} onChange={e => setMesFiltro(Number(e.target.value))}
          style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '6px 10px' }}>
          {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={anioFiltro} onChange={e => setAnioFiltro(Number(e.target.value))}
          style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '6px 10px' }}>
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={() => { setMesFiltro(now.getMonth() + 1); setAnioFiltro(now.getFullYear()); }}
          className="cursor-pointer" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, background: 'transparent', border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '6px 12px' }}>
          ESTE MES
        </button>
      </div>

      {/* ═══ Empty state with suggestions ═══ */}
      {!loading && budgetRows.length === 0 ? (
        <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
          <Wallet size={32} style={{ color: nd.textDisabled, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: mono, fontSize: '13px', color: nd.textSecondary, letterSpacing: '0.06em' }}>
            SIN PRESUPUESTOS PARA {monthNames[mesFiltro - 1]} {anioFiltro}
          </p>
          {suggestPeriods.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, width: '100%', marginBottom: '4px' }}>PERIODOS CON DATOS:</span>
              {suggestPeriods.map(p => (
                <button key={`${p.mes}-${p.anio}`} onClick={() => { setMesFiltro(p.mes); setAnioFiltro(p.anio); }}
                  className="cursor-pointer" style={{ fontFamily: mono, fontSize: '10px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`, borderRadius: '4px', padding: '4px 10px' }}>
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ═══ 4 Stats Cards ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ marginBottom: '24px' }}>
            {[
              { label: 'TOTAL ASIGNADO', value: formatMoney(totalAllocated), color: nd.textDisplay },
              { label: 'TOTAL GASTADO', value: formatMoney(totalSpent), color: nd.error },
              { label: 'DISPONIBLE', value: formatMoney(totalRemaining), color: nd.success },
              { label: 'EN RIESGO', value: `${partidasEnRiesgo}`, color: nd.warning, sub: `DE ${budgetRows.length} PARTIDAS` },
            ].map(s => (
              <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
                <p style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '6px' }}>{s.value}</p>
                {s.sub && <p style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, marginTop: '4px' }}>{s.sub}</p>}
              </div>
            ))}
          </div>

          {/* ═══ Mejora 5: Comparativa mes anterior ═══ */}
          {comparison ? (
            <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '12px' }}>
                COMPARATIVA VS {monthNames[comparison.prevMes - 1]}
              </span>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'ASIGNADO', delta: comparison.allocDelta },
                  { label: 'GASTADO', delta: comparison.spentDelta },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    {c.delta > 0 ? <TrendingUp size={14} style={{ color: nd.error }} /> :
                     c.delta < 0 ? <TrendingDown size={14} style={{ color: nd.success }} /> :
                     <Minus size={14} style={{ color: nd.textDisabled }} />}
                    <div>
                      <p style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>{c.label}</p>
                      <p style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: c.delta > 0 ? nd.error : c.delta < 0 ? nd.success : nd.textSecondary }}>
                        {c.delta > 0 ? '+' : ''}{c.delta}%
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Wallet size={14} style={{ color: nd.textSecondary }} />
                  <div>
                    <p style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>PARTIDAS</p>
                    <p style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: nd.textPrimary }}>
                      {comparison.currentCount} VS {comparison.prevCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '12px 16px', marginBottom: '24px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em' }}>SIN DATOS PREVIOS PARA COMPARAR</span>
            </div>
          )}

          {/* ═══ Overall Progress Segmented ═══ */}
          <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>EJECUCION TOTAL</span>
              <span style={{ fontFamily: mono, fontSize: '24px', fontWeight: 700, color: getPctColor(totalPct) }}>{totalPct}%</span>
            </div>
            <div className="flex gap-[2px]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={`t-${i}`} style={{
                  flex: 1, height: '16px',
                  background: i < Math.round((Math.min(totalPct, 100) / 100) * 30) ? getPctColor(totalPct) : nd.border,
                }} />
              ))}
            </div>
          </div>

          {/* ═══ Bar Chart ═══ */}
          {barData.length > 0 && (
            <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '20px' }}>
                ASIGNADO VS GASTADO
              </span>
              <ResponsiveContainer width="100%" height={Math.max(160, barData.length * 44)}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid stroke={nd.border} horizontal={false} vertical />
                  <XAxis type="number" tick={{ fontSize: 10, fill: nd.textDisabled, fontFamily: mono }} tickFormatter={v => `$${v / 1000}k`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: nd.textSecondary, fontFamily: mono }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}
                    contentStyle={{ background: nd.surfaceRaised, border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', fontSize: '12px', fontFamily: mono, color: nd.textPrimary }} />
                  <Bar dataKey="asignado" fill={nd.border} name="Asignado" />
                  <Bar dataKey="gastado" fill={nd.textDisplay} name="Gastado" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2"><div className="w-4 h-[2px]" style={{ background: nd.border }} /><span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary }}>ASIGNADO</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-[2px]" style={{ background: nd.textDisplay }} /><span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary }}>GASTADO</span></div>
              </div>
            </div>
          )}

          {/* ═══ Detail Header: Search + Sort + View Toggle ═══ */}
          <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3" style={{ marginBottom: '20px' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, whiteSpace: 'nowrap' }}>DETALLE POR PARTIDA</span>
              <div className="flex-1" />
              {/* Mejora 6: Search */}
              <div className="flex items-center gap-2" style={{ background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '4px 10px', maxWidth: '220px', width: '100%' }}>
                <Search size={13} style={{ color: nd.textDisabled, flexShrink: 0 }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="BUSCAR PARTIDA..."
                  style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textPrimary, background: 'transparent', border: 'none', outline: 'none', width: '100%' }} />
              </div>
              {/* Sort control */}
              <div className="flex" style={{ border: `1px solid ${nd.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                {([['pctDesc', '% ↓'], ['pctAsc', '% ↑'], ['nombre', 'A-Z']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setSortBy(val)} className="cursor-pointer"
                    style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.06em', padding: '5px 10px', border: 'none',
                      color: sortBy === val ? nd.textDisplay : nd.textDisabled, background: sortBy === val ? nd.borderVisible : 'transparent' }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Mejora 10: View toggle */}
              <div className="flex" style={{ border: `1px solid ${nd.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                {([['detail', 'DETALLE'], ['compact', 'COMPACTA']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setViewMode(val)} className="cursor-pointer"
                    style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.06em', padding: '5px 10px', border: 'none',
                      color: viewMode === val ? nd.textDisplay : nd.textDisabled, background: viewMode === val ? nd.borderVisible : 'transparent' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, padding: '8px 0' }}>[CARGANDO PRESUPUESTOS]</div>
            )}

            {!loading && searchQuery && sortedBudgets.length === 0 && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, padding: '16px 0', textAlign: 'center' }}>
                SIN RESULTADOS PARA '{searchQuery.toUpperCase()}'
              </div>
            )}

            {/* ═══ Vista COMPACTA ═══ */}
            {!loading && viewMode === 'compact' && sortedBudgets.length > 0 && (
              <div>
                {/* Header row - desktop */}
                <div className="hidden sm:grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px 80px', gap: '8px', padding: '8px 0', borderBottom: `1px solid ${nd.border}` }}>
                  {['PARTIDA', 'CATEGORÍA', 'ASIGNADO', 'GASTADO', '%', 'ESTADO'].map(h => (
                    <span key={h} style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.08em', color: nd.textDisabled }}>{h}</span>
                  ))}
                </div>
                {sortedBudgets.map(b => {
                  const badge = getBadge(b.pct);
                  return (
                    <div key={b.id} className="sm:grid items-center py-2" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px 80px', gap: '8px', borderBottom: `1px solid ${nd.border}` }}>
                      {/* Mobile: compact card */}
                      <div className="sm:hidden flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
                          <span style={{ fontSize: '12px', color: nd.textPrimary }}>{b.name}</span>
                        </div>
                        <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 700, color: getPctColor(b.pct) }}>{b.pct}%</span>
                      </div>
                      {/* Desktop columns */}
                      <span className="hidden sm:block" style={{ fontSize: '12px', color: nd.textPrimary }}>{b.name}</span>
                      <span className="hidden sm:block" style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{b.category.toUpperCase()}</span>
                      <span className="hidden sm:block" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>{formatMoney(b.allocated)}</span>
                      <span className="hidden sm:block" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>{formatMoney(b.spent)}</span>
                      <span className="hidden sm:block" style={{ fontFamily: mono, fontSize: '12px', fontWeight: 700, color: getPctColor(b.pct) }}>{b.pct}%</span>
                      <div className="hidden sm:flex items-center gap-1">
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
                        <span style={{ fontFamily: mono, fontSize: '9px', color: badge.color }}>{badge.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ═══ Vista DETALLE ═══ */}
            {!loading && viewMode === 'detail' && sortedBudgets.map((b, idx) => {
              const color = getPctColor(b.pct);
              const badge = getBadge(b.pct);
              const segments = 20;
              const filled = Math.round((Math.min(b.pct, 100) / 100) * segments);
              const daysLeft = getDaysLeft(b.mes, b.anio);
              const donut = getDonutData(b.spent, b.allocated);
              const isExpanded = expandedHistorial === b.id;
              const lastGastos = b.gastos.slice(-5).reverse();

              return (
                <div key={b.id} className="py-4" style={{ borderBottom: idx < sortedBudgets.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
                  <div className="flex items-start gap-3">
                    {/* Mejora 4: Mini donut */}
                    <div className="hidden sm:block" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <PieChart width={50} height={50}>
                        <Pie data={donut} dataKey="value" cx={25} cy={25} innerRadius={14} outerRadius={22} strokeWidth={0}>
                          {donut.map((d, i) => (
                            <Cell key={d.key} fill={d.key === 'remaining' ? nd.border : d.key === 'excess' ? nd.error : color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <p style={{ fontSize: '14px', color: nd.textPrimary }}>{b.name}</p>
                            <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.06em', color: badge.color, border: `1px solid ${badge.color}33`, borderRadius: '3px', padding: '1px 6px' }}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, letterSpacing: '0.06em' }}>{b.category.toUpperCase()}</span>
                            <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>·</span>
                            <span style={{ fontFamily: mono, fontSize: '9px', color: daysLeft <= 7 ? nd.warning : nd.textDisabled }}>{daysLeft}D RESTANTES</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: mono, fontSize: '16px', fontWeight: 700, color }}>{b.pct}%</span>
                          {b.pct > 90 && <AlertTriangle size={14} style={{ color: nd.error }} />}
                          {b.pct < 50 && b.pct > 0 && <CheckCircle size={14} style={{ color: nd.success }} />}
                        </div>
                      </div>

                      {/* Segmented bar */}
                      <div className="flex gap-[2px]" style={{ marginBottom: '6px' }}>
                        {Array.from({ length: segments }).map((_, si) => (
                          <div key={`s-${b.id}-${si}`} style={{ flex: 1, height: '8px', background: si < filled ? color : nd.border }} />
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>
                          GASTADO {formatMoney(b.spent)} / {formatMoney(b.allocated)}
                        </span>
                        <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>
                          RESTANTE {formatMoney(b.remaining)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 mt-3">
                        <button onClick={() => openGasto(b.id)} className="flex items-center gap-1 cursor-pointer"
                          style={{ fontFamily: mono, fontSize: '9px', color: nd.textSecondary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '4px', padding: '4px 8px' }}>
                          <Wallet size={12} /> GASTO
                        </button>
                        <button onClick={() => openEdit(b)} className="cursor-pointer"
                          style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '4px' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDuplicate(b)} className="cursor-pointer"
                          style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '4px' }}>
                          <Copy size={14} />
                        </button>
                        <button onClick={() => setExpandedHistorial(isExpanded ? null : b.id)} className="cursor-pointer"
                          style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '4px' }}>
                          <ClipboardList size={14} />
                        </button>
                        {/* Mejora 8: arrows */}
                        {sortBy === 'nombre' && (
                          <>
                            <button onClick={() => handleMoveUp(idx)} className="cursor-pointer"
                              style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '2px' }}><ChevronUp size={16} /></button>
                            <button onClick={() => handleMoveDown(idx)} className="cursor-pointer"
                              style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '2px' }}><ChevronDown size={16} /></button>
                          </>
                        )}
                        <div className="flex-1" />
                        {deleteConfirmId === b.id ? (
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: mono, fontSize: '9px', color: nd.error }}>ELIMINAR?</span>
                            <button onClick={() => handleDelete(b.id)} className="cursor-pointer"
                              style={{ fontFamily: mono, fontSize: '9px', color: nd.error, background: 'transparent', border: `1px solid ${nd.error}`, borderRadius: '3px', padding: '2px 8px' }}>SÍ</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="cursor-pointer"
                              style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, background: 'transparent', border: `1px solid ${nd.border}`, borderRadius: '3px', padding: '2px 8px' }}>NO</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(b.id)} className="cursor-pointer"
                            style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Mejora 1: Inline historial */}
                      {isExpanded && (
                        <div style={{ marginTop: '12px', borderTop: `1px solid ${nd.border}`, paddingTop: '10px' }}>
                          {lastGastos.length === 0 ? (
                            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>[SIN GASTOS REGISTRADOS]</span>
                          ) : (
                            <>
                              {lastGastos.map(g => (
                                <div key={g.id} className="flex items-center gap-3 py-1">
                                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, flexShrink: 0 }}>{g.fecha}</span>
                                  <span style={{ fontSize: '11px', color: nd.textSecondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.descripcion}</span>
                                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.error, flexShrink: 0 }}>{formatMoney(g.monto)}</span>
                                </div>
                              ))}
                              {b.gastos.length > 5 && (
                                <button onClick={() => setHistorialModalId(b.id)} className="cursor-pointer mt-1"
                                  style={{ fontFamily: mono, fontSize: '9px', color: nd.textSecondary, background: 'transparent', border: 'none', textDecoration: 'underline' }}>
                                  VER TODOS ({b.gastos.length})
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ MODALS ═══ */}
      {/* ═══════════════════════════════════════════ */}

      {/* ═══ Modal: Crear Presupuesto ═══ */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setCreateModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '420px' }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.08em', color: nd.textDisplay }}>NUEVO PRESUPUESTO</span>
              <button onClick={() => setCreateModal(false)} className="cursor-pointer" style={{ color: nd.textDisabled, background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>NOMBRE</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nombre de la partida"
                  style={{ fontFamily: grotesk, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>CATEGORÍA</label>
                <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                  style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%' }}>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>MONTO ASIGNADO</label>
                  <input type="number" value={formAllocated} onChange={e => setFormAllocated(e.target.value)} placeholder="0"
                    style={{ fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>GASTADO INICIAL</label>
                  <input type="number" value={formSpent} onChange={e => setFormSpent(e.target.value)} placeholder="0"
                    style={{ fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
                </div>
              </div>

              {/* Mejora 9: Recurrente */}
              <div style={{ borderTop: `1px solid ${nd.border}`, paddingTop: '12px' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formRecurrente} onChange={e => setFormRecurrente(e.target.checked)}
                    style={{ accentColor: nd.accent }} />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>CREAR COMO RECURRENTE (MENSUAL)</span>
                </label>
                {formRecurrente && (
                  <div className="mt-3">
                    <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>MESES A CREAR</label>
                    <select value={formMesesRecurrentes} onChange={e => setFormMesesRecurrentes(Number(e.target.value))}
                      style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '6px 10px' }}>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <p style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, marginTop: '6px' }}>
                      SE CREARÁN {formMesesRecurrentes + 1} PRESUPUESTOS ({monthNames[mesFiltro - 1]}
                      {Array.from({ length: formMesesRecurrentes }, (_, i) => {
                        let nm = mesFiltro + i + 1;
                        if (nm > 12) nm -= 12;
                        return ` → ${monthNames[nm - 1]}`;
                      }).join('')})
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setCreateModal(false)} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, background: 'transparent', border: `1px solid ${nd.border}`, borderRadius: '20px', padding: '8px 20px' }}>
                CANCELAR
              </button>
              <button onClick={handleCreate} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisplay, background: nd.accent, border: 'none', borderRadius: '20px', padding: '8px 20px' }}>
                CREAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Editar Presupuesto ═══ */}
      {editModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setEditModalId(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px' }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.08em', color: nd.textDisplay }}>EDITAR PRESUPUESTO</span>
              <button onClick={() => setEditModalId(null)} className="cursor-pointer" style={{ color: nd.textDisabled, background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>NOMBRE</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  style={{ fontFamily: grotesk, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>CATEGORÍA</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                  style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%' }}>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>MONTO ASIGNADO</label>
                <input type="number" value={editAllocated} onChange={e => setEditAllocated(e.target.value)}
                  style={{ fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
                {(() => {
                  const orig = budgets.find(b => b.id === editModalId);
                  const diff = parseFloat(editAllocated) - (orig?.allocated || 0);
                  if (diff === 0 || isNaN(diff)) return null;
                  return <p style={{ fontFamily: mono, fontSize: '9px', color: diff > 0 ? nd.success : nd.error, marginTop: '4px' }}>
                    DELTA: {diff > 0 ? '+' : ''}{formatMoney(diff)}
                  </p>;
                })()}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditModalId(null)} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, background: 'transparent', border: `1px solid ${nd.border}`, borderRadius: '20px', padding: '8px 20px' }}>
                CANCELAR
              </button>
              <button onClick={handleEdit} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisplay, background: nd.accent, border: 'none', borderRadius: '20px', padding: '8px 20px' }}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Gasto Rápido ═══ */}
      {gastoModalId && gastoTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => { setGastoModalId(null); setGastoExcede(false); setGastoConfirm(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px' }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.08em', color: nd.textDisplay }}>REGISTRAR GASTO</span>
              <button onClick={() => { setGastoModalId(null); setGastoExcede(false); setGastoConfirm(false); }} className="cursor-pointer" style={{ color: nd.textDisabled, background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '12px', color: nd.textSecondary, marginBottom: '16px' }}>{gastoTarget.name}</p>

            <div className="flex flex-col gap-4">
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>MONTO</label>
                <input type="number" value={gastoMonto} onChange={e => { setGastoMonto(e.target.value); setGastoExcede(false); setGastoConfirm(false); }} placeholder="0"
                  style={{ fontFamily: mono, fontSize: '18px', color: nd.textDisplay, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '10px 12px', width: '100%', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>DESCRIPCIÓN</label>
                <input value={gastoDesc} onChange={e => setGastoDesc(e.target.value)} placeholder="Descripción del gasto"
                  style={{ fontFamily: grotesk, fontSize: '13px', color: nd.textPrimary, background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '6px', padding: '8px 12px', width: '100%', outline: 'none' }} />
              </div>

              {/* Preview en tiempo real */}
              {gastoMontoNum > 0 && (
                <div style={{ background: nd.surfaceRaised, borderRadius: '8px', padding: '12px' }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>ACTUAL</span>
                    <span style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>{formatMoney(gastoTarget.spent)} / {formatMoney(gastoTarget.allocated)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>DESPUÉS</span>
                    <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, color: gastoWillExceed ? nd.error : nd.textPrimary }}>
                      {formatMoney(gastoNewSpent)} / {formatMoney(gastoTarget.allocated)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>EJECUCIÓN</span>
                    <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, color: getPctColor(gastoNewPct) }}>{gastoNewPct}%</span>
                  </div>
                </div>
              )}

              {/* Confirmación exceso */}
              {gastoExcede && gastoWillExceed && (
                <label className="flex items-center gap-2 cursor-pointer" style={{ background: 'rgba(215,25,33,0.1)', borderRadius: '6px', padding: '10px' }}>
                  <input type="checkbox" checked={gastoConfirm} onChange={e => setGastoConfirm(e.target.checked)} style={{ accentColor: nd.error }} />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.error, letterSpacing: '0.04em' }}>CONFIRMO QUE ESTE GASTO EXCEDE EL PRESUPUESTO</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setGastoModalId(null); setGastoExcede(false); setGastoConfirm(false); }} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, background: 'transparent', border: `1px solid ${nd.border}`, borderRadius: '20px', padding: '8px 20px' }}>
                CANCELAR
              </button>
              <button onClick={handleGasto} className="cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisplay, background: nd.accent, border: 'none', borderRadius: '20px', padding: '8px 20px',
                  opacity: gastoExcede && !gastoConfirm ? 0.5 : 1, pointerEvents: gastoExcede && !gastoConfirm ? 'none' : 'auto' }}>
                REGISTRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Historial Completo ═══ */}
      {historialModalId && historialBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setHistorialModalId(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span style={{ fontFamily: mono, fontSize: '13px', letterSpacing: '0.08em', color: nd.textDisplay }}>HISTORIAL DE GASTOS</span>
                <p style={{ fontSize: '12px', color: nd.textSecondary, marginTop: '2px' }}>{historialBudget.name}</p>
              </div>
              <button onClick={() => setHistorialModalId(null)} className="cursor-pointer" style={{ color: nd.textDisabled, background: 'transparent', border: 'none' }}><X size={18} /></button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {historialBudget.gastos.length === 0 ? (
                <span style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisabled }}>[SIN GASTOS REGISTRADOS]</span>
              ) : (
                [...historialBudget.gastos].reverse().map(g => (
                  <div key={g.id} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${nd.border}` }}>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, flexShrink: 0 }}>{g.fecha}</span>
                    <span style={{ fontSize: '12px', color: nd.textSecondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.descripcion}</span>
                    <span style={{ fontFamily: mono, fontSize: '11px', color: nd.error, flexShrink: 0 }}>{formatMoney(g.monto)}</span>
                    <button onClick={() => handleDeleteGasto(historialBudget.id, g.id)} className="cursor-pointer"
                      style={{ color: nd.textDisabled, background: 'transparent', border: 'none', padding: '2px', flexShrink: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = nd.error)} onMouseLeave={e => (e.currentTarget.style.color = nd.textDisabled)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {historialBudget.gastos.length > 0 && (
              <div className="flex justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${nd.borderVisible}` }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>TOTAL ({historialBudget.gastos.length} GASTOS)</span>
                <span style={{ fontFamily: mono, fontSize: '14px', fontWeight: 700, color: nd.error }}>
                  {formatMoney(historialBudget.gastos.reduce((a, g) => a + g.monto, 0))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
