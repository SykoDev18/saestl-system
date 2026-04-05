import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Event } from '../../data/mockData';

const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4A9E5C',
};
const mono = "'Space Mono', monospace";

const typeOptions = [
  { key: 'deportivo', label: 'DEPORTIVO', color: '#e87722' },
  { key: 'academico', label: 'ACADEMICO', color: '#5B9BF6' },
  { key: 'cultural', label: 'CULTURAL', color: '#D71921' },
  { key: 'social', label: 'SOCIAL', color: '#4A9E5C' },
];

interface Props {
  onClose: () => void;
  onCreate: (event: Omit<Event, 'id' | 'registered' | 'participants'>) => void | Promise<void>;
}

export function CreateEventWizard({ onClose, onCreate }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('deportivo');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('60');
  const [hasCost, setHasCost] = useState(false);
  const [cost, setCost] = useState('');
  const [costPer, setCostPer] = useState<'persona' | 'equipo'>('persona');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return date.length > 0 && location.trim().length > 0;
    return true;
  };

  const handlePublish = () => {
    onCreate({
      name, description, date, time: startTime, endTime: endTime || undefined,
      location, type: type as Event['type'], capacity: parseInt(capacity) || 100,
      budget: 0, status: 'proximo', cost: hasCost ? parseFloat(cost) || 0 : 0,
      costPer: hasCost ? costPer : undefined, organizer: 'Juan Perez',
      requirements: requirements.split('\n').filter(r => r.trim()), notes: notes || undefined,
    });
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: mono, fontSize: '13px', color: nd.textPrimary, background: 'transparent',
    borderBottom: `1px solid ${nd.borderVisible}`, padding: '10px 0', width: '100%', outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    fontFamily: mono, fontSize: '12px', color: nd.textPrimary, background: nd.surface,
    border: `1px solid ${nd.borderVisible}`, borderRadius: '4px', padding: '10px 12px', width: '100%', cursor: 'pointer',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="w-full max-w-[600px] max-h-[90vh] flex flex-col" style={{ background: nd.surface, border: `1px solid ${nd.borderVisible}`, borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${nd.border}` }}>
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
            CREAR EVENTO — PASO {step}/4
          </span>
          <button onClick={onClose} className="cursor-pointer" style={{ color: nd.textDisabled }}><X size={16} strokeWidth={1.5} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: '2px', background: step >= s ? nd.textDisplay : nd.border }} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>NOMBRE</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del evento..." style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '12px' }}>TIPO</label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map(t => (
                    <button key={t.key} onClick={() => setType(t.key)} className="h-11 cursor-pointer transition-all duration-150"
                      style={{
                        fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', borderRadius: '4px',
                        border: `1px solid ${type === t.key ? t.color : nd.borderVisible}`,
                        background: type === t.key ? t.color + '20' : 'transparent',
                        color: type === t.key ? t.color : nd.textSecondary,
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px' }}>DESCRIPCION</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe el evento..."
                  className="w-full outline-none resize-none" style={{ ...inputStyle, height: '80px', borderBottom: 'none', border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', padding: '12px', fontFamily: mono }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ display: 'block', marginBottom: '8px' }}>FECHA</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={selectStyle} /></div>
                <div><label style={{ display: 'block', marginBottom: '8px' }}>HORA INICIO</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={selectStyle} /></div>
              </div>
              <div><label style={{ display: 'block', marginBottom: '8px' }}>HORA FIN</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={selectStyle} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px' }}>UBICACION</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Lugar..." style={inputStyle} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px' }}>NOTAS</label><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas..." style={inputStyle} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px' }}>REQUISITOS (UNO POR LINEA)</label>
                <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Requisito 1..." className="w-full outline-none resize-none"
                  style={{ ...inputStyle, height: '60px', borderBottom: 'none', border: `1px solid ${nd.borderVisible}`, borderRadius: '8px', padding: '12px', fontFamily: mono }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div><label style={{ display: 'block', marginBottom: '8px' }}>CAPACIDAD</label><input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} style={inputStyle} /></div>
              <div>
                <label style={{ display: 'block', marginBottom: '12px' }}>COSTO</label>
                <div className="flex" style={{ border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', maxWidth: '200px' }}>
                  <button onClick={() => setHasCost(false)} className="flex-1 h-9 cursor-pointer" style={{ fontFamily: mono, fontSize: '10px', borderRadius: '999px', background: !hasCost ? nd.textDisplay : 'transparent', color: !hasCost ? nd.black : nd.textSecondary }}>GRATIS</button>
                  <button onClick={() => setHasCost(true)} className="flex-1 h-9 cursor-pointer" style={{ fontFamily: mono, fontSize: '10px', borderRadius: '999px', background: hasCost ? nd.textDisplay : 'transparent', color: hasCost ? nd.black : nd.textSecondary }}>CON COSTO</button>
                </div>
                {hasCost && (
                  <div className="flex items-center gap-3 mt-4">
                    <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="$0" style={{ ...inputStyle, width: '100px' }} />
                    <div className="flex gap-2">
                      {(['persona', 'equipo'] as const).map(opt => (
                        <button key={opt} onClick={() => setCostPer(opt)} className="cursor-pointer"
                          style={{ fontFamily: mono, fontSize: '10px', padding: '4px 12px', border: `1px solid ${costPer === opt ? nd.textDisplay : nd.borderVisible}`, borderRadius: '999px', color: costPer === opt ? nd.textDisplay : nd.textSecondary, background: 'transparent' }}>
                          {opt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, display: 'block', marginBottom: '16px' }}>RESUMEN</span>
              <div style={{ background: nd.surfaceRaised, borderRadius: '8px', padding: '16px' }}>
                <div style={{ borderLeft: `3px solid ${typeOptions.find(t => t.key === type)?.color || nd.textSecondary}`, paddingLeft: '12px' }}>
                  <h3 style={{ fontSize: '18px', color: nd.textDisplay, marginBottom: '4px' }}>{name || 'Sin nombre'}</h3>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: typeOptions.find(t => t.key === type)?.color }}>{type.toUpperCase()}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    ['FECHA', date ? new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                    ['HORA', startTime || '—'],
                    ['LUGAR', location || '—'],
                    ['CUPO', `${capacity} participantes`],
                    ['COSTO', hasCost ? `$${cost || '0'} / ${costPer}` : 'GRATIS'],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${nd.border}` }}>
                      <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textDisabled }}>{l}</span>
                      <span style={{ fontSize: '13px', color: nd.textPrimary }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${nd.border}` }}>
          <div>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 cursor-pointer"
                style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.textSecondary }}>
                <ChevronLeft size={14} strokeWidth={1.5} /> VOLVER
              </button>
            )}
          </div>
          {step < 4 ? (
            <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="flex items-center gap-1 h-10 px-6 cursor-pointer disabled:opacity-30"
              style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em' }}>
              SIGUIENTE <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          ) : (
            <button onClick={handlePublish} className="flex items-center gap-2 h-10 px-6 cursor-pointer"
              style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em' }}>
              <Check size={14} strokeWidth={1.5} /> PUBLICAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
