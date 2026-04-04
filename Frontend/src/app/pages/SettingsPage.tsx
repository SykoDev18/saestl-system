import { useState } from 'react';
import { User, Mail, Phone, Shield, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

const nd = {
  surface: '#111', border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', black: '#000',
};
const mono = "'Space Mono', monospace";

export function SettingsPage() {
  const [name, setName] = useState('Juan Perez Garcia');
  const [email, setEmail] = useState('juan.perez@uaeh.edu.mx');
  const [phone, setPhone] = useState('771-123-4567');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) { toast.error('[ERROR: CAMPOS REQUERIDOS]'); return; }
    toast.success('[SAVED]');
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: mono, fontSize: '13px', color: nd.textPrimary,
    background: 'transparent', borderBottom: `1px solid ${nd.borderVisible}`,
    padding: '10px 0', width: '100%', outline: 'none',
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="cursor-pointer transition-all duration-200"
      style={{
        width: '44px', height: '24px', borderRadius: '999px', position: 'relative',
        background: on ? nd.textDisplay : nd.borderVisible,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', position: 'absolute', top: '3px',
        left: on ? '23px' : '3px', background: on ? nd.black : nd.textDisabled,
        transition: 'left 200ms ease-out',
      }} />
    </button>
  );

  return (
    <div className="max-w-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Config
        </h1>
        <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
          PERFIL Y PREFERENCIAS
        </p>
      </div>

      {/* Profile */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '32px' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
            background: nd.accent, color: '#fff', fontFamily: mono, fontSize: '20px', fontWeight: 700, letterSpacing: '0.04em',
          }}>
            JP
          </div>
          <div>
            <p style={{ fontSize: '18px', color: nd.textDisplay }}>{name}</p>
            <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>
              TESORERO
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { label: 'NOMBRE', icon: User, value: name, onChange: setName },
            { label: 'CORREO', icon: Mail, value: email, onChange: setEmail },
            { label: 'TELEFONO', icon: Phone, value: phone, onChange: setPhone },
          ].map(field => (
            <div key={field.label}>
              <label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
                {field.label}
              </label>
              <div className="relative">
                <field.icon size={14} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: nd.textDisabled }} />
                <input value={field.value} onChange={e => field.onChange(e.target.value)} style={{ ...inputStyle, paddingLeft: '24px' }} />
              </div>
            </div>
          ))}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
              ROL
            </label>
            <div className="flex items-center gap-2">
              <Shield size={14} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
              <span style={{ fontFamily: mono, fontSize: '13px', color: nd.textDisabled }}>TESORERO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Bell size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary }}>
            NOTIFICACIONES
          </span>
        </div>
        <div className="space-y-0">
          {[
            { label: 'EMAIL', on: notifEmail, toggle: () => setNotifEmail(!notifEmail) },
            { label: 'PUSH', on: notifPush, toggle: () => setNotifPush(!notifPush) },
            { label: 'SMS', on: notifSms, toggle: () => setNotifSms(!notifSms) },
          ].map((n, i, arr) => (
            <div key={n.label} className="flex items-center justify-between py-4" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
              <span style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary }}>{n.label}</span>
              <Toggle on={n.on} onToggle={n.toggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full h-12 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
        style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '13px', letterSpacing: '0.06em' }}
      >
        <Save size={16} strokeWidth={1.5} /> GUARDAR
      </button>
    </div>
  );
}
