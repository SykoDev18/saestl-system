import { useState, useEffect, useRef } from 'react';
import {
  Ticket, Plus, X, ShoppingCart, Dice5, Users,
  ChevronLeft, Trophy
} from 'lucide-react';
import { rifas as initialRifas, type Rifa } from '../data/mockData';
import { toast } from 'sonner';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C', warning: '#D4A843', error: '#D71921', raffle: '#a855f7',
};
const mono = "'Space Mono', monospace";

export function RifasPage() {
  const [rifas, setRifas] = useState(initialRifas);
  const [selectedRifa, setSelectedRifa] = useState<Rifa | null>(null);
  const [sellModal, setSellModal] = useState(false);
  const [sorteoModal, setSorteoModal] = useState<'confirm' | 'sorting' | 'result' | null>(null);
  const [winner, setWinner] = useState<{ ticket: number; name: string; phone: string } | null>(null);
  const [sorteoNumbers, setSorteoNumbers] = useState('???');
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPaid, setBuyerPaid] = useState(true);
  const { isHidden } = useFinancialPrivacy();
  const sorteoIntervalRef = useRef<any>(null);

  const openSell = (rifa: Rifa) => {
    setSelectedRifa(rifa); setSelectedTickets([]); setBuyerName(''); setBuyerPhone('');
    setBuyerEmail(''); setBuyerPaid(true); setSellModal(true);
  };

  const toggleTicket = (num: number) => setSelectedTickets(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);

  const handleSell = () => {
    if (!selectedRifa || selectedTickets.length === 0 || !buyerName || !buyerPhone) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    setRifas(prev => prev.map(r => {
      if (r.id !== selectedRifa.id) return r;
      const newTickets = r.tickets.map(t => selectedTickets.includes(t.number) ? { ...t, sold: true, buyerName, buyerPhone, buyerEmail, soldBy: 'Juan Perez', soldDate: new Date().toISOString().split('T')[0], paid: buyerPaid } : t);
      return { ...r, tickets: newTickets, soldTickets: newTickets.filter(t => t.sold).length };
    }));
    toast.success(`[SOLD: ${selectedTickets.length}]`);
    setSellModal(false);
  };

  const startSorteo = () => {
    if (!selectedRifa) return;
    setSorteoModal('sorting');
    const soldTickets = selectedRifa.tickets.filter(t => t.sold);
    let count = 0;
    sorteoIntervalRef.current = setInterval(() => {
      const rand = soldTickets[Math.floor(Math.random() * soldTickets.length)];
      setSorteoNumbers(rand.number.toString().padStart(3, '0'));
      count++;
      if (count > 30) {
        clearInterval(sorteoIntervalRef.current);
        const winnerTicket = soldTickets[Math.floor(Math.random() * soldTickets.length)];
        setWinner({ ticket: winnerTicket.number, name: winnerTicket.buyerName || 'N/A', phone: winnerTicket.buyerPhone || 'N/A' });
        setSorteoModal('result');
        setRifas(prev => prev.map(r => r.id === selectedRifa.id ? { ...r, status: 'sorteada' as const, winner: { name: winnerTicket.buyerName!, phone: winnerTicket.buyerPhone!, ticket: winnerTicket.number } } : r));
      }
    }, 100);
  };

  useEffect(() => { return () => { if (sorteoIntervalRef.current) clearInterval(sorteoIntervalRef.current); }; }, []);

  const inputStyle: React.CSSProperties = { fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`, padding: '8px 0', width: '100%', outline: 'none' };

  // DETAIL VIEW
  if (selectedRifa && !sellModal && !sorteoModal) {
    const r = rifas.find(ri => ri.id === selectedRifa.id) || selectedRifa;
    const pct = Math.round((r.soldTickets / r.totalTickets) * 100);
    const income = r.soldTickets * r.pricePerTicket;
    const segments = 25;
    const filled = Math.round((pct / 100) * segments);

    return (
      <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <button onClick={() => setSelectedRifa(null)} className="flex items-center gap-2 cursor-pointer mb-6" style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary, letterSpacing: '0.06em' }}>
          <ChevronLeft size={14} strokeWidth={1.5} /> VOLVER
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Ticket size={20} strokeWidth={1.5} style={{ color: nd.raffle }} />
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '28px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em' }}>{r.name}</h1>
          <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: r.status === 'activa' ? nd.success : r.status === 'sorteada' ? nd.raffle : nd.textDisabled }}>
            [{r.status.toUpperCase()}]
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'VENDIDOS', value: r.soldTickets.toString(), color: nd.raffle },
            { label: 'DISPONIBLES', value: (r.totalTickets - r.soldTickets).toString(), color: nd.success },
            { label: 'INGRESOS', value: `$${income.toLocaleString()}`, color: nd.textDisplay, fin: true },
            { label: 'PRECIO/BOLETO', value: `$${r.pricePerTicket}`, color: nd.warning, fin: true },
          ].map(s => (
            <div key={s.label} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{s.label}</p>
              <p style={{ fontFamily: mono, fontSize: '22px', fontWeight: 700, color: s.color, lineHeight: 1, marginTop: '6px' }}>
                {s.fin && isHidden ? '$•••••' : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Segmented progress */}
        <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>PROGRESO DE VENTA</span>
            <span style={{ fontFamily: mono, fontSize: '20px', fontWeight: 700, color: nd.raffle }}>{pct}%</span>
          </div>
          <div className="flex gap-[2px]">
            {Array.from({ length: segments }).map((_, i) => (
              <div key={`prog-${i}`} style={{ flex: 1, height: '12px', background: i < filled ? nd.raffle : nd.border }} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{r.soldTickets} VENDIDOS</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{r.totalTickets} TOTAL</span>
          </div>
        </div>

        {/* Winner */}
        {r.winner && (
          <div style={{ background: nd.surface, border: `1px solid ${nd.warning}`, borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
            <Trophy size={24} strokeWidth={1.5} style={{ color: nd.warning, margin: '0 auto 12px' }} />
            <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.warning, display: 'block' }}>GANADOR</span>
            <p style={{ fontSize: '20px', color: nd.textDisplay, marginTop: '8px' }}>{r.winner.name}</p>
            <p style={{ fontFamily: mono, fontSize: '14px', color: nd.raffle, marginTop: '4px' }}>#{r.winner.ticket}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          {r.status === 'activa' && (
            <>
              <button onClick={() => openSell(r)} className="flex items-center gap-2 cursor-pointer"
                style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em' }}>
                <ShoppingCart size={14} strokeWidth={1.5} /> VENDER
              </button>
              <button onClick={() => setSorteoModal('confirm')} className="flex items-center gap-2 cursor-pointer"
                style={{ height: '44px', padding: '0 24px', border: `1px solid ${nd.warning}`, color: nd.warning, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', background: 'transparent' }}>
                <Dice5 size={14} strokeWidth={1.5} /> SORTEAR
              </button>
            </>
          )}
        </div>

        {/* Sold tickets table */}
        <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px' }}>
          <div className="px-5 py-3" style={{ borderBottom: `1px solid ${nd.border}` }}>
            <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>BOLETOS VENDIDOS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${nd.borderVisible}` }}>
                  {['#', 'COMPRADOR', 'TEL', 'PAGO'].map(h => (
                    <th key={h} className="px-4 py-2 text-left" style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.tickets.filter(t => t.sold).slice(0, 15).map(t => (
                  <tr key={t.number} style={{ borderBottom: `1px solid ${nd.border}`, background: r.winner?.ticket === t.number ? nd.surfaceRaised : 'transparent' }}>
                    <td className="px-4 py-2" style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary }}>
                      {t.number} {r.winner?.ticket === t.number && <Trophy size={12} className="inline" style={{ color: nd.warning }} />}
                    </td>
                    <td className="px-4 py-2" style={{ fontSize: '13px', color: nd.textPrimary }}>{t.buyerName}</td>
                    <td className="px-4 py-2" style={{ fontFamily: mono, fontSize: '11px', color: nd.textDisabled }}>{t.buyerPhone}</td>
                    <td className="px-4 py-2">
                      <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: t.paid ? nd.success : nd.warning }}>
                        [{t.paid ? 'PAGADO' : 'PEND'}]
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sorteo Modal */}
        {sorteoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <div style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
              {sorteoModal === 'confirm' && (
                <>
                  <Dice5 size={32} strokeWidth={1.5} style={{ color: nd.warning, margin: '0 auto 16px' }} />
                  <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '8px' }}>REALIZAR SORTEO</span>
                  <p style={{ fontFamily: mono, fontSize: '12px', color: nd.textDisabled, marginBottom: '24px' }}>PARTICIPANTES: {r.soldTickets}</p>
                  <div className="flex gap-3">
                    <button onClick={() => setSorteoModal(null)} className="flex-1 h-11 cursor-pointer" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', color: nd.textSecondary, background: 'transparent' }}>CANCELAR</button>
                    <button onClick={startSorteo} className="flex-1 h-11 cursor-pointer" style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px' }}>SORTEAR</button>
                  </div>
                </>
              )}
              {sorteoModal === 'sorting' && (
                <>
                  <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '16px' }}>SORTEANDO...</span>
                  <div style={{ fontFamily: "'Doto', monospace", fontSize: '48px', fontWeight: 700, color: nd.raffle, margin: '16px 0' }}>{sorteoNumbers}</div>
                  <p style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>[LOADING...]</p>
                </>
              )}
              {sorteoModal === 'result' && winner && (
                <>
                  <Trophy size={32} strokeWidth={1.5} style={{ color: nd.warning, margin: '0 auto 16px' }} />
                  <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.warning, display: 'block', marginBottom: '8px' }}>GANADOR</span>
                  <div style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, marginBottom: '8px' }}>#{winner.ticket}</div>
                  <p style={{ fontSize: '18px', color: nd.textPrimary }}>{winner.name}</p>
                  <p style={{ fontFamily: mono, fontSize: '12px', color: nd.textDisabled, marginTop: '4px' }}>{winner.phone}</p>
                  <button onClick={() => { setSorteoModal(null); }} className="w-full h-11 cursor-pointer mt-6" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', color: nd.textSecondary, background: 'transparent' }}>CERRAR</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // GRID VIEW
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Rifas</h1>
          <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>GESTION DE BOLETOS</p>
        </div>
        <button className="flex items-center gap-2 cursor-pointer shrink-0"
          style={{ height: '44px', padding: '0 24px', background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}>
          <Plus size={16} strokeWidth={1.5} /> NUEVA RIFA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rifas.map(r => {
          const pct = Math.round((r.soldTickets / r.totalTickets) * 100);
          const segments = 15;
          const filled = Math.round((pct / 100) * segments);
          return (
            <div key={r.id} style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '20px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ticket size={16} strokeWidth={1.5} style={{ color: nd.raffle }} />
                  <h3 style={{ fontSize: '15px', color: nd.textPrimary }}>{r.name}</h3>
                </div>
                <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: r.status === 'activa' ? nd.success : r.status === 'sorteada' ? nd.raffle : nd.textDisabled }}>
                  [{r.status.toUpperCase()}]
                </span>
              </div>

              {/* Segmented bar */}
              <div className="flex gap-[2px] mb-2">
                {Array.from({ length: segments }).map((_, i) => (
                  <div key={`rifa-seg-${r.id}-${i}`} style={{ flex: 1, height: '8px', background: i < filled ? nd.raffle : nd.border }} />
                ))}
              </div>
              <div className="flex justify-between mb-4">
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{r.soldTickets}/{r.totalTickets}</span>
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.raffle }}>{pct}%</span>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>PRECIO</span>
                  <span style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary }}>${r.pricePerTicket}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, letterSpacing: '0.06em' }}>SORTEO</span>
                  <span style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary }}>{new Date(r.drawDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).toUpperCase()}</span>
                </div>
              </div>

              {r.winner && (
                <div className="flex items-center gap-2 py-2 mb-3" style={{ borderTop: `1px solid ${nd.border}`, borderBottom: `1px solid ${nd.border}` }}>
                  <Trophy size={12} strokeWidth={1.5} style={{ color: nd.warning }} />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: nd.warning, letterSpacing: '0.04em' }}>
                    {r.winner.name} #{r.winner.ticket}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <button onClick={() => setSelectedRifa(r)} className="w-full h-9 cursor-pointer transition-colors duration-150"
                  style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.textSecondary, background: 'transparent' }}>
                  VER DETALLE
                </button>
                {r.status === 'activa' && (
                  <button onClick={() => openSell(r)} className="w-full h-9 cursor-pointer transition-all duration-150"
                    style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em' }}>
                    VENDER
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sell Modal */}
      {sellModal && selectedRifa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setSellModal(false)}>
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto" style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>VENDER BOLETOS</span>
              <button onClick={() => setSellModal(false)} className="cursor-pointer" style={{ color: nd.textDisabled }}><X size={16} strokeWidth={1.5} /></button>
            </div>

            {/* Ticket grid */}
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1.5" style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>
                  <span className="w-2 h-2" style={{ background: nd.border }} /> SOLD
                </span>
                <span className="flex items-center gap-1.5" style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>
                  <span className="w-2 h-2" style={{ background: nd.success }} /> AVAIL
                </span>
                <span className="flex items-center gap-1.5" style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>
                  <span className="w-2 h-2" style={{ background: nd.raffle }} /> SEL
                </span>
              </div>
              <div className="grid gap-1 max-h-[180px] overflow-y-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))' }}>
                {selectedRifa.tickets.slice(0, 100).map(t => (
                  <button key={t.number} disabled={t.sold} onClick={() => toggleTicket(t.number)}
                    className="h-8 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-colors duration-100"
                    style={{
                      fontFamily: mono, fontSize: '10px',
                      background: t.sold ? nd.border : selectedTickets.includes(t.number) ? nd.raffle : nd.surfaceRaised,
                      color: t.sold ? nd.textDisabled : selectedTickets.includes(t.number) ? '#fff' : nd.success,
                      border: selectedTickets.includes(t.number) ? `1px solid ${nd.raffle}` : `1px solid ${nd.border}`,
                      borderRadius: '4px',
                    }}>
                    {t.number}
                  </button>
                ))}
              </div>
              {selectedTickets.length > 0 && (
                <p style={{ fontFamily: mono, fontSize: '11px', color: nd.raffle, marginTop: '8px' }}>
                  {selectedTickets.length} SEL · ${(selectedTickets.length * selectedRifa.pricePerTicket).toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-5">
              <div><label style={{ display: 'block', marginBottom: '8px' }}>NOMBRE</label><input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Nombre..." style={inputStyle} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ display: 'block', marginBottom: '8px' }}>TELEFONO</label><input value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="771..." style={inputStyle} /></div>
                <div><label style={{ display: 'block', marginBottom: '8px' }}>EMAIL</label><input value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="@" style={inputStyle} /></div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setSellModal(false)} className="flex-1 h-11 cursor-pointer" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', fontFamily: mono, fontSize: '12px', color: nd.textSecondary, background: 'transparent' }}>CANCELAR</button>
              <button onClick={handleSell} className="flex-1 h-11 cursor-pointer" style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px' }}>VENDER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
