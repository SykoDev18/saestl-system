import { useState, useEffect, useMemo } from 'react';
import {
  User, Mail, Phone, Shield, Bell, Save, Pencil, Camera,
  Hash, GraduationCap, BookOpen, Lock, Eye, EyeOff, Monitor,
  LogOut, Palette, Github, Users, X, Download, Trash2,
  AlertTriangle, Clock, Building2, Keyboard, Wifi, WifiOff,
  HardDrive, ChevronDown, ChevronUp, Check, RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useFinancialPrivacy } from '../components/FinancialPrivacyContext';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/AuthContext';
import { configService, type UpdatePreferencesRequest, type UserConfigResponse } from '../services/configService';

/* ── design tokens ── */
const nd = {
  black: '#000', surface: '#111', surfaceRaised: '#1A1A1A',
  border: '#222', borderVisible: '#333',
  textDisabled: '#666', textSecondary: '#999', textPrimary: '#E8E8E8', textDisplay: '#FFF',
  accent: '#8B1C23', success: '#4ade80', warning: '#facc15', error: '#f87171',
};
const mono = "'Space Mono', monospace";

/* ── static data ── */
const ACCENT_COLORS = [
  { name: 'Guinda', value: '#8B1C23' },
  { name: 'Azul', value: '#1D4ED8' },
  { name: 'Esmeralda', value: '#059669' },
  { name: 'Ámbar', value: '#D97706' },
  { name: 'Violeta', value: '#7C3AED' },
  { name: 'Cyan', value: '#0891B2' },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'Inicio de sesión', date: '2026-04-25T10:30:00', ip: '192.168.1.45' },
  { id: 2, action: 'Contraseña cambiada', date: '2026-04-24T15:20:00', ip: '192.168.1.45' },
  { id: 3, action: 'Perfil actualizado', date: '2026-04-23T09:15:00', ip: '10.0.0.12' },
  { id: 4, action: 'Presupuesto creado', date: '2026-04-22T14:00:00', ip: '192.168.1.45' },
  { id: 5, action: 'Transacción registrada', date: '2026-04-21T11:45:00', ip: '10.0.0.12' },
  { id: 6, action: 'Exportación de datos', date: '2026-04-20T16:30:00', ip: '192.168.1.45' },
];

const ROLES_PERMISSIONS = [
  { role: 'PRESIDENTE', permisos: ['Ver todo', 'Editar todo', 'Eliminar', 'Gestionar usuarios'] },
  { role: 'TESORERO', permisos: ['Ver todo', 'Editar transacciones', 'Crear presupuestos', 'Exportar'] },
  { role: 'SECRETARIO', permisos: ['Ver todo', 'Editar eventos', 'Crear reportes'] },
  { role: 'VOCAL', permisos: ['Ver dashboard', 'Ver eventos', 'Ver presupuestos'] },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'Búsqueda rápida' },
  { keys: ['Ctrl', 'N'], action: 'Nueva transacción' },
  { keys: ['Ctrl', 'E'], action: 'Exportar datos' },
  { keys: ['Ctrl', ','], action: 'Configuración' },
  { keys: ['Esc'], action: 'Cerrar modal' },
];

/* ── component ── */
export function SettingsPage() {
  const { isHidden, toggle: togglePrivacy } = useFinancialPrivacy();
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  /* profile */
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('771-123-4567');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [carrera, setCarrera] = useState('Ingeniería en Computación');
  const [semestre, setSemestre] = useState('6');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState(user?.role ?? 'USER');

  /* notifications */
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifEventos, setNotifEventos] = useState(true);
  const [notifPresupuestos, setNotifPresupuestos] = useState(true);
  const [notifTransacciones, setNotifTransacciones] = useState(false);

  /* security */
  const [showPwd, setShowPwd] = useState(false);
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  /* appearance */
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [accentColor, setAccentColor] = useState('#8B1C23');
  const [language, setLanguage] = useState('es');

  /* collapsibles */
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [activityLimit, setActivityLimit] = useState(4);

  /* danger zone */
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  /* connectivity */
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const applyConfig = (config: UserConfigResponse) => {
    setName(config.fullName || '');
    setEmail(config.email || '');
    setPhone(config.phone || '');
    setNumeroCuenta(config.numeroCuenta || '');
    setCarrera(config.carrera || '');
    setSemestre(config.semestre || '');
    setBio(config.bio || '');
    setRole(config.role || 'USER');
    setNotifEmail(config.notifEmail);
    setNotifPush(config.notifPush);
    setNotifSms(config.notifSms);
    setNotifEventos(config.notifEventos);
    setNotifPresupuestos(config.notifPresupuestos);
    setNotifTransacciones(config.notifTransacciones);
    setTheme(config.theme || 'dark');
    setAccentColor(config.accentColor || '#8B1C23');
    setLanguage(config.language || 'es');
  };

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await configService.get();
        applyConfig(config);
      } catch {
        if (user) {
          setName(user.fullName);
          setEmail(user.email);
          setRole(user.role);
        }
      }
    };
    void loadConfig();
  }, [user]);

  /* derived */
  const profileCompleteness = useMemo(() => {
    const filled = [name, email, phone, numeroCuenta, carrera, semestre, bio].filter(f => f.trim().length > 0).length;
    return Math.round((filled / 7) * 100);
  }, [name, email, phone, numeroCuenta, carrera, semestre, bio]);

  const pwdStrength = useMemo(() => {
    if (!newPwd) return { level: 0, label: '', color: nd.textDisabled };
    let s = 0;
    if (newPwd.length >= 8) s++;
    if (/[A-Z]/.test(newPwd)) s++;
    if (/[0-9]/.test(newPwd)) s++;
    if (/[^A-Za-z0-9]/.test(newPwd)) s++;
    return ([
      { level: 1, label: 'DÉBIL', color: nd.error },
      { level: 2, label: 'REGULAR', color: nd.warning },
      { level: 3, label: 'BUENA', color: '#60a5fa' },
      { level: 4, label: 'FUERTE', color: nd.success },
    ][s - 1] ?? { level: 0, label: '', color: nd.textDisabled });
  }, [newPwd]);

  /* helpers */
  const fmtPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  };
  const initials = (n: string) => n.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fmtDate = (ds: string) => new Date(ds).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  /* handlers */
  const buildPreferencesPayload = (overrides: Partial<UpdatePreferencesRequest> = {}): UpdatePreferencesRequest => ({
    theme,
    accentColor,
    language,
    notifEmail,
    notifPush,
    notifSms,
    notifEventos,
    notifPresupuestos,
    notifTransacciones,
    ...overrides,
  });

  const savePreferences = async (overrides: Partial<UpdatePreferencesRequest> = {}, successMessage = '[PREFERENCIAS GUARDADAS]') => {
    try {
      const saved = await configService.updatePreferences(buildPreferencesPayload(overrides));
      applyConfig(saved);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? `[ERROR: ${error.message.toUpperCase()}]` : '[ERROR: NO SE PUDIERON GUARDAR LAS PREFERENCIAS]');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) { toast.error('[CAMPOS REQUERIDOS]'); return; }
    if (!email.includes('@')) { toast.error('[EMAIL INVÁLIDO]'); return; }
    try {
      const saved = await configService.updateProfile({
        fullName: name.trim(),
        email: email.trim(),
        phone,
        numeroCuenta,
        carrera,
        semestre,
        bio,
      });
      if (saved.token) {
        localStorage.setItem('token', saved.token);
      }
      applyConfig(saved);
      await refreshUser();
      setEditMode(false);
      toast.success('[PERFIL GUARDADO]');
    } catch (error) {
      toast.error(error instanceof Error ? `[ERROR: ${error.message.toUpperCase()}]` : '[ERROR: NO SE PUDO GUARDAR EL PERFIL]');
    }
  };

  const handlePwdChange = async () => {
    if (!curPwd) { toast.error('[CONTRASEÑA ACTUAL REQUERIDA]'); return; }
    if (newPwd.length < 8) { toast.error('[MÍNIMO 8 CARACTERES]'); return; }
    if (newPwd !== confirmPwd) { toast.error('[CONTRASEÑAS NO COINCIDEN]'); return; }
    try {
      await configService.changePassword({ currentPassword: curPwd, newPassword: newPwd });
      setCurPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('[CONTRASEÑA ACTUALIZADA]');
    } catch (error) {
      toast.error(error instanceof Error ? `[ERROR: ${error.message.toUpperCase()}]` : '[ERROR: NO SE PUDO ACTUALIZAR LA CONTRASEÑA]');
    }
  };

  const handleExport = () => {
    const data = { name, email, phone, numeroCuenta, carrera, semestre, role };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mis-datos-saestl.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success('[DATOS EXPORTADOS]');
  };

  const handleLogout = () => { logout(); navigate('/login'); toast.success('[SESIÓN CERRADA]'); };

  const handleDeleteAccount = () => {
    if (deleteText !== 'ELIMINAR') return;
    toast.success('[CUENTA ELIMINADA]');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleReset = async () => {
    await savePreferences({
      theme: 'dark',
      accentColor: '#8B1C23',
      language: 'es',
      notifEmail: true,
      notifPush: true,
      notifSms: false,
      notifEventos: true,
      notifPresupuestos: true,
      notifTransacciones: false,
    }, '[PREFERENCIAS RESTABLECIDAS]');
  };

  /* styles */
  const inp: React.CSSProperties = {
    fontFamily: mono, fontSize: '13px', color: nd.textPrimary,
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${nd.borderVisible}`,
    padding: '10px 0', width: '100%', outline: 'none',
  };
  const sec: React.CSSProperties = { background: nd.surface, border: `1px solid ${nd.border}`, borderRadius: '12px', padding: '24px', marginBottom: '16px' };
  const lbl: React.CSSProperties = { display: 'block', marginBottom: '8px', fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary };
  const sh: React.CSSProperties = { fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="cursor-pointer transition-all duration-200"
      style={{ width: '44px', height: '24px', borderRadius: '999px', position: 'relative', background: on ? nd.textDisplay : nd.borderVisible, border: 'none' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', position: 'absolute', top: '3px',
        left: on ? '23px' : '3px', background: on ? nd.black : nd.textDisabled, transition: 'left 200ms ease-out' }} />
    </button>
  );

  const PillBtn = ({ children, onClick, variant = 'secondary', disabled }: {
    children: React.ReactNode; onClick?: () => void; variant?: 'secondary' | 'destructive' | 'warning'; disabled?: boolean;
  }) => {
    const colors = { secondary: nd.borderVisible, destructive: nd.error, warning: `${nd.warning}60` };
    const fg = { secondary: nd.textSecondary, destructive: nd.error, warning: nd.warning };
    return (
      <button onClick={onClick} disabled={disabled}
        className="flex items-center gap-1.5 cursor-pointer transition-opacity duration-150 hover:opacity-80"
        style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: fg[variant], background: 'transparent',
          border: `1px solid ${colors[variant]}`, borderRadius: '999px', padding: '6px 12px', opacity: disabled ? 0.4 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {children}
      </button>
    );
  };

  const storageUsed = 12.4;
  const storageTotal = 50;

  return (
    <div className="w-full max-w-[680px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Doto', monospace", fontSize: '36px', fontWeight: 700, color: nd.textDisplay, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Config
        </h1>
        <p style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.08em', color: nd.textSecondary, textTransform: 'uppercase', marginTop: '8px' }}>
          PERFIL · SEGURIDAD · PREFERENCIAS
        </p>
      </div>

      {/* ── PERFIL ────────────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-2">
            <User size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
            <span style={sh}>PERFIL</span>
          </div>
          <div className="flex items-center gap-2">
            <PillBtn onClick={handleExport}><Download size={12} strokeWidth={1.5} /> EXPORTAR</PillBtn>
            <button onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1.5 cursor-pointer transition-colors duration-150 hover:opacity-80"
              style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em',
                color: editMode ? nd.textDisplay : nd.textSecondary, background: 'transparent',
                border: `1px solid ${editMode ? nd.textDisplay : nd.borderVisible}`, borderRadius: '999px', padding: '6px 12px' }}>
              {editMode ? <><X size={12} strokeWidth={1.5} /> CANCELAR</> : <><Pencil size={12} strokeWidth={1.5} /> EDITAR</>}
            </button>
          </div>
        </div>

        {/* avatar */}
        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ background: accentColor, color: '#fff', fontFamily: mono, fontSize: '20px', fontWeight: 700 }}>
              {initials(name)}
            </div>
            {editMode && (
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: nd.textDisplay, color: nd.black, border: 'none' }}
                onClick={() => toast('[PRÓXIMAMENTE: CAMBIAR FOTO]')}>
                <Camera size={12} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ fontSize: '18px', color: nd.textDisplay, fontWeight: 500 }}>{name}</p>
            <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textSecondary }}>{role}</span>
          </div>
        </div>

        {/* completeness */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textSecondary }}>PERFIL COMPLETO</span>
            <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: profileCompleteness === 100 ? nd.success : nd.textSecondary }}>{profileCompleteness}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: nd.border, borderRadius: '2px' }}>
            <div style={{ width: `${profileCompleteness}%`, height: '100%', borderRadius: '2px',
              background: profileCompleteness === 100 ? nd.success : accentColor, transition: 'width 300ms ease-out' }} />
          </div>
        </div>

        {/* fields */}
        <div className="space-y-5">
          {([
            { label: 'NOMBRE COMPLETO', icon: User, value: name, onChange: setName },
            { label: 'CORREO INSTITUCIONAL', icon: Mail, value: email, onChange: setEmail },
            { label: 'TELÉFONO', icon: Phone, value: phone, onChange: (v: string) => setPhone(fmtPhone(v)) },
            { label: 'NÚMERO DE CUENTA', icon: Hash, value: numeroCuenta, onChange: setNumeroCuenta },
            { label: 'CARRERA', icon: GraduationCap, value: carrera, onChange: setCarrera },
            { label: 'SEMESTRE', icon: BookOpen, value: semestre, onChange: setSemestre },
          ] as const).map(f => (
            <div key={f.label}>
              <label style={lbl}>{f.label}</label>
              <div className="relative">
                <f.icon size={14} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ color: nd.textDisabled }} />
                {editMode
                  ? <input value={f.value} onChange={e => f.onChange(e.target.value)} style={{ ...inp, paddingLeft: '24px' }} />
                  : <p style={{ fontFamily: mono, fontSize: '13px', color: f.value ? nd.textPrimary : nd.textDisabled, padding: '10px 0 10px 24px' }}>{f.value || '—'}</p>}
              </div>
            </div>
          ))}
          <div>
            <label style={lbl}>ROL</label>
            <div className="flex items-center gap-2" style={{ padding: '10px 0' }}>
              <Shield size={14} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
              <span style={{ fontFamily: mono, fontSize: '13px', color: nd.textDisabled }}>{role}</span>
            </div>
          </div>
        </div>

        {editMode && (
          <button onClick={handleSave}
            className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 mt-6"
            style={{ background: nd.textDisplay, color: nd.black, borderRadius: '999px', fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', border: 'none' }}>
            <Save size={14} strokeWidth={1.5} /> GUARDAR PERFIL
          </button>
        )}
      </div>

      {/* ── NOTIFICACIONES ────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Bell size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>NOTIFICACIONES</span>
        </div>
          {([
          { label: 'EMAIL', desc: 'Resumen semanal y alertas', on: notifEmail, toggle: () => void savePreferences({ notifEmail: !notifEmail }) },
          { label: 'PUSH', desc: 'Alertas en tiempo real', on: notifPush, toggle: () => void savePreferences({ notifPush: !notifPush }) },
          { label: 'SMS', desc: 'Sólo alertas urgentes', on: notifSms, toggle: () => void savePreferences({ notifSms: !notifSms }) },
          { label: 'EVENTOS', desc: 'Nuevos eventos y recordatorios', on: notifEventos, toggle: () => void savePreferences({ notifEventos: !notifEventos }) },
          { label: 'PRESUPUESTOS', desc: 'Alertas de límite', on: notifPresupuestos, toggle: () => void savePreferences({ notifPresupuestos: !notifPresupuestos }) },
          { label: 'TRANSACCIONES', desc: 'Cada registro nuevo', on: notifTransacciones, toggle: () => void savePreferences({ notifTransacciones: !notifTransacciones }) },
        ]).map((n, i, arr) => (
          <div key={n.label} className="flex items-center justify-between py-3.5" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
            <div>
              <span style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary, display: 'block' }}>{n.label}</span>
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>{n.desc}</span>
            </div>
            <Toggle on={n.on} onToggle={n.toggle} />
          </div>
        ))}
      </div>

      {/* ── SEGURIDAD ─────────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Lock size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>SEGURIDAD</span>
        </div>

        <div className="space-y-5">
          <div>
            <label style={lbl}>CONTRASEÑA ACTUAL</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={curPwd} onChange={e => setCurPwd(e.target.value)}
                style={{ ...inp, paddingRight: '32px' }} placeholder="••••••••" />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ background: 'transparent', border: 'none', color: nd.textDisabled }}>
                {showPwd ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          <div>
            <label style={lbl}>NUEVA CONTRASEÑA</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={inp} placeholder="Mín. 8 caracteres" />
            {newPwd && (
              <div className="flex items-center gap-2 mt-2">
                <div style={{ flex: 1, height: '3px', background: nd.border, borderRadius: '2px' }}>
                  <div style={{ width: `${pwdStrength.level * 25}%`, height: '100%', background: pwdStrength.color, borderRadius: '2px', transition: 'width 200ms' }} />
                </div>
                <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.06em', color: pwdStrength.color }}>{pwdStrength.label}</span>
              </div>
            )}
          </div>
          <div>
            <label style={lbl}>CONFIRMAR CONTRASEÑA</label>
            <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} style={inp} placeholder="Repetir contraseña" />
            {confirmPwd && confirmPwd !== newPwd && (
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.error, marginTop: '4px', display: 'block' }}>NO COINCIDE</span>
            )}
          </div>
          <button onClick={handlePwdChange}
            className="w-full h-10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            style={{ background: 'transparent', color: nd.textPrimary, border: `1px solid ${nd.borderVisible}`, borderRadius: '999px',
              fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em' }}>
            <Lock size={14} strokeWidth={1.5} /> CAMBIAR CONTRASEÑA
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${nd.border}`, marginTop: '20px', paddingTop: '20px' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary, display: 'block' }}>SESIÓN ACTIVA</span>
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>Última actividad: hace 2 min</span>
            </div>
            <PillBtn onClick={handleLogout} variant="destructive"><LogOut size={12} strokeWidth={1.5} /> CERRAR SESIÓN</PillBtn>
          </div>
        </div>
      </div>

      {/* ── ROLES Y PERMISOS ──────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Users size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>ROLES Y PERMISOS</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textDisabled, textAlign: 'left', paddingBottom: '12px' }}>ROL</th>
                <th style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textDisabled, textAlign: 'left', paddingBottom: '12px' }}>PERMISOS</th>
              </tr>
            </thead>
            <tbody>
              {ROLES_PERMISSIONS.map((r, i) => (
                <tr key={r.role} style={{ borderTop: i > 0 ? `1px solid ${nd.border}` : 'none' }}>
                  <td style={{ fontFamily: mono, fontSize: '11px', color: r.role === role ? accentColor : nd.textPrimary,
                    padding: '12px 12px 12px 0', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {r.role}
                    {r.role === role && <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled, display: 'block', marginTop: '2px' }}>TÚ</span>}
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <div className="flex flex-wrap gap-1.5">
                      {r.permisos.map(p => (
                        <span key={p} style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.04em',
                          color: nd.textSecondary, border: `1px solid ${nd.border}`, borderRadius: '999px', padding: '3px 8px' }}>{p}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ACTIVIDAD RECIENTE ─────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center justify-between" style={{ marginBottom: showActivity ? '16px' : '0' }}>
          <div className="flex items-center gap-2">
            <Clock size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
            <span style={sh}>ACTIVIDAD RECIENTE</span>
          </div>
          <button onClick={() => setShowActivity(!showActivity)} className="cursor-pointer"
            style={{ background: 'transparent', border: 'none', color: nd.textSecondary }}>
            {showActivity ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
          </button>
        </div>
        {showActivity && (
          <>
            {RECENT_ACTIVITY.slice(0, activityLimit).map((a, i, arr) => (
              <div key={a.id} className="flex items-center justify-between py-3" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
                <div className="min-w-0 mr-3">
                  <span className="block truncate" style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary }}>{a.action}</span>
                  <span style={{ fontFamily: mono, fontSize: '9px', color: nd.textDisabled }}>{a.ip}</span>
                </div>
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled, whiteSpace: 'nowrap' }}>{fmtDate(a.date)}</span>
              </div>
            ))}
            {activityLimit < RECENT_ACTIVITY.length && (
              <button onClick={() => setActivityLimit(RECENT_ACTIVITY.length)}
                className="w-full mt-3 cursor-pointer transition-opacity hover:opacity-80"
                style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textSecondary, background: 'transparent', border: 'none', textAlign: 'center' }}>
                VER TODO ({RECENT_ACTIVITY.length})
              </button>
            )}
          </>
        )}
      </div>

      {/* ── ORGANIZACIÓN ──────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Building2 size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>ORGANIZACIÓN</span>
        </div>
        <div className="space-y-4">
          {[
            { label: 'NOMBRE', value: 'SAESTL — Soc. Alumnos de Ing. en Ciencias de la Computación' },
            { label: 'INSTITUCIÓN', value: 'Universidad Autónoma del Estado de Hidalgo' },
            { label: 'PERIODO', value: '2025 – 2026' },
            { label: 'MIEMBROS', value: '8 activos' },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between gap-4">
              <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textDisabled, whiteSpace: 'nowrap', paddingTop: '2px' }}>{item.label}</span>
              <span style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary, textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── APARIENCIA ────────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Palette size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>APARIENCIA</span>
        </div>

        {/* theme selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={lbl}>TEMA</label>
          <div className="flex gap-2">
            {([{ key: 'dark', label: 'OSCURO' }, { key: 'light', label: 'CLARO' }, { key: 'auto', label: 'AUTO' }] as const).map(t => (
              <button key={t.key} onClick={() => void savePreferences({ theme: t.key })}
                className="flex-1 h-9 flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em',
                  background: theme === t.key ? nd.textDisplay : 'transparent',
                  color: theme === t.key ? nd.black : nd.textSecondary,
                  border: `1px solid ${theme === t.key ? nd.textDisplay : nd.borderVisible}`, borderRadius: '999px' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* accent color */}
        <div style={{ marginBottom: '20px' }}>
          <label style={lbl}>COLOR ACENTO</label>
          <div className="flex gap-2 flex-wrap">
            {ACCENT_COLORS.map(c => (
              <button key={c.value} onClick={() => void savePreferences({ accentColor: c.value })} title={c.name}
                className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all duration-150"
                style={{ background: c.value, border: accentColor === c.value ? `2px solid ${nd.textDisplay}` : '2px solid transparent' }}>
                {accentColor === c.value && <Check size={14} strokeWidth={2.5} style={{ color: '#fff' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* privacy toggle */}
        <div className="flex items-center justify-between py-3" style={{ borderTop: `1px solid ${nd.border}`, borderBottom: `1px solid ${nd.border}` }}>
          <div>
            <span style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '0.06em', color: nd.textPrimary, display: 'block' }}>PRIVACIDAD FINANCIERA</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>Ocultar montos con •••</span>
          </div>
          <Toggle on={isHidden} onToggle={togglePrivacy} />
        </div>

        {/* language */}
        <div style={{ marginTop: '16px' }}>
          <label style={lbl}>IDIOMA</label>
          <div className="flex gap-2">
            {[{ key: 'es', label: 'ESPAÑOL' }, { key: 'en', label: 'ENGLISH' }].map(l => (
              <button key={l.key} onClick={() => void savePreferences({ language: l.key })}
                className="flex-1 h-9 flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em',
                  background: language === l.key ? nd.textDisplay : 'transparent',
                  color: language === l.key ? nd.black : nd.textSecondary,
                  border: `1px solid ${language === l.key ? nd.textDisplay : nd.borderVisible}`, borderRadius: '999px' }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* keyboard shortcuts */}
        <div style={{ marginTop: '20px', borderTop: `1px solid ${nd.border}`, paddingTop: '16px' }}>
          <button onClick={() => setShowShortcuts(!showShortcuts)} className="flex items-center justify-between w-full cursor-pointer"
            style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <div className="flex items-center gap-2">
              <Keyboard size={14} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
              <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: nd.textSecondary }}>ATAJOS DE TECLADO</span>
            </div>
            {showShortcuts ? <ChevronUp size={14} style={{ color: nd.textSecondary }} /> : <ChevronDown size={14} style={{ color: nd.textSecondary }} />}
          </button>
          {showShortcuts && (
            <div className="mt-3">
              {SHORTCUTS.map((s, i, arr) => (
                <div key={s.action} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${nd.border}` : 'none' }}>
                  <span style={{ fontFamily: mono, fontSize: '11px', color: nd.textPrimary }}>{s.action}</span>
                  <div className="flex gap-1">
                    {s.keys.map(k => (
                      <kbd key={k} style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary,
                        background: nd.surfaceRaised, border: `1px solid ${nd.border}`, borderRadius: '4px', padding: '2px 6px' }}>{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ACERCA DE ─────────────────────────────────── */}
      <div style={sec}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <Monitor size={16} strokeWidth={1.5} style={{ color: nd.textSecondary }} />
          <span style={sh}>ACERCA DE</span>
        </div>

        <div className="space-y-3">
          {[
            { label: 'VERSIÓN', value: 'v2.4.0' },
            { label: 'BUILD', value: '2026.04.25' },
            { label: 'FRONTEND', value: 'React 18 + Vite' },
            { label: 'BACKEND', value: 'Spring Boot 3' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.08em', color: nd.textDisabled }}>{item.label}</span>
              <span style={{ fontFamily: mono, fontSize: '11px', color: nd.textSecondary }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* connection & storage */}
        <div style={{ borderTop: `1px solid ${nd.border}`, marginTop: '16px', paddingTop: '16px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
            {isOnline
              ? <Wifi size={14} strokeWidth={1.5} style={{ color: nd.success }} />
              : <WifiOff size={14} strokeWidth={1.5} style={{ color: nd.error }} />}
            <span style={{ fontFamily: mono, fontSize: '11px', color: isOnline ? nd.success : nd.error }}>
              {isOnline ? 'CONECTADO' : 'SIN CONEXIÓN'}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
              <div className="flex items-center gap-2">
                <HardDrive size={14} strokeWidth={1.5} style={{ color: nd.textDisabled }} />
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>ALMACENAMIENTO LOCAL</span>
              </div>
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary }}>{storageUsed} / {storageTotal} MB</span>
            </div>
            <div style={{ width: '100%', height: '3px', background: nd.border, borderRadius: '2px' }}>
              <div style={{ width: `${(storageUsed / storageTotal) * 100}%`, height: '100%', background: nd.textSecondary, borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* links */}
        <div className="flex gap-2 flex-wrap mt-4">
          <a href="https://github.com/saestl" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textSecondary,
              border: `1px solid ${nd.borderVisible}`, borderRadius: '999px', padding: '6px 12px', textDecoration: 'none' }}>
            <Github size={12} strokeWidth={1.5} /> GITHUB
          </a>
          <span className="flex items-center gap-1.5"
            style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.06em', color: nd.textDisabled,
              border: `1px solid ${nd.border}`, borderRadius: '999px', padding: '6px 12px' }}>
            <Users size={12} strokeWidth={1.5} /> 4 DEVELOPERS
          </span>
        </div>
      </div>

      {/* ── ZONA DE PELIGRO ───────────────────────────── */}
      <div style={{ ...sec, border: `1px solid ${nd.error}30`, marginBottom: '40px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <AlertTriangle size={16} strokeWidth={1.5} style={{ color: nd.error }} />
          <span style={{ ...sh, color: nd.error }}>ZONA DE PELIGRO</span>
        </div>

        <div className="space-y-4">
          {/* reset prefs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary, display: 'block' }}>RESTABLECER PREFERENCIAS</span>
              <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>Volver a valores por defecto</span>
            </div>
            <PillBtn onClick={handleReset} variant="warning"><RotateCcw size={12} strokeWidth={1.5} /> RESTABLECER</PillBtn>
          </div>

          {/* delete account */}
          <div style={{ borderTop: `1px solid ${nd.border}`, paddingTop: '16px' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span style={{ fontFamily: mono, fontSize: '12px', color: nd.textPrimary, display: 'block' }}>ELIMINAR CUENTA</span>
                <span style={{ fontFamily: mono, fontSize: '10px', color: nd.textDisabled }}>Esta acción es irreversible</span>
              </div>
              {!deleteConfirm
                ? <PillBtn onClick={() => setDeleteConfirm(true)} variant="destructive"><Trash2 size={12} strokeWidth={1.5} /> ELIMINAR</PillBtn>
                : <button onClick={() => { setDeleteConfirm(false); setDeleteText(''); }} className="cursor-pointer"
                    style={{ fontFamily: mono, fontSize: '10px', color: nd.textSecondary, background: 'transparent', border: 'none' }}>CANCELAR</button>}
            </div>
            {deleteConfirm && (
              <div className="mt-4">
                <label style={{ ...lbl, color: nd.error }}>ESCRIBE &quot;ELIMINAR&quot; PARA CONFIRMAR</label>
                <input value={deleteText} onChange={e => setDeleteText(e.target.value.toUpperCase())}
                  style={{ ...inp, borderBottomColor: nd.error }} placeholder="ELIMINAR" />
                <button onClick={handleDeleteAccount} disabled={deleteText !== 'ELIMINAR'}
                  className="w-full h-10 flex items-center justify-center gap-2 mt-3 transition-all duration-150"
                  style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em',
                    background: deleteText === 'ELIMINAR' ? nd.error : 'transparent',
                    color: deleteText === 'ELIMINAR' ? '#fff' : nd.textDisabled,
                    border: `1px solid ${deleteText === 'ELIMINAR' ? nd.error : nd.border}`,
                    borderRadius: '999px', cursor: deleteText === 'ELIMINAR' ? 'pointer' : 'not-allowed' }}>
                  <Trash2 size={14} strokeWidth={1.5} /> ELIMINAR MI CUENTA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
