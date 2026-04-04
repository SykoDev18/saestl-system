import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Bell, ChevronDown, Menu, User, Settings, LogOut, AlertTriangle, Info, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { notifications } from '../../data/mockData';
import { useFinancialPrivacy } from '../FinancialPrivacyContext';
import saestiLogo from '../../../assets/saestl-logo.png';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Header({ sidebarCollapsed, onMenuClick }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isHidden, toggle } = useFinancialPrivacy();
  const navigate = useNavigate();
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeDropdowns = useCallback(() => {
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDropdowns(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeDropdowns]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={`fixed top-0 right-0 h-[56px] z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-200 left-0
        ${sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-[240px]'}
      `}
      style={{
        background: 'var(--nd-surface)',
        borderBottom: '1px solid var(--nd-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 cursor-pointer"
          style={{ color: 'var(--nd-text-secondary)' }}
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <img src={saestiLogo} alt="SAESTL" className="w-6 h-6 object-contain" />
          <span style={{
            fontFamily: "'Doto', monospace",
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--nd-text-display)',
          }}>
            SAESTL
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        {/* Privacy toggle */}
        <button
          onClick={toggle}
          className="relative p-2 cursor-pointer transition-colors duration-150"
          style={{ color: isHidden ? 'var(--nd-accent)' : 'var(--nd-text-disabled)' }}
          title={isHidden ? 'Mostrar datos' : 'Ocultar datos'}
        >
          {isHidden ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          {isHidden && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--nd-accent)' }}
            />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 cursor-pointer"
            style={{ color: 'var(--nd-text-disabled)' }}
          >
            <Bell size={18} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--nd-accent)',
                  color: '#fff',
                  fontSize: '9px',
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 top-11 w-80 overflow-hidden"
              style={{
                background: 'var(--nd-surface-raised)',
                border: '1px solid var(--nd-border-visible)',
                borderRadius: '8px',
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--nd-border)' }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--nd-text-secondary)',
                }}>
                  NOTIFICACIONES
                </span>
              </div>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className="px-4 py-3 flex gap-3 cursor-pointer transition-colors duration-150"
                  style={{
                    borderBottom: '1px solid var(--nd-border)',
                    background: !n.read ? 'var(--nd-accent-subtle)' : 'transparent',
                  }}
                >
                  <div className="mt-0.5" style={{
                    color: n.type === 'warning' ? 'var(--nd-warning)' : n.type === 'success' ? 'var(--nd-success)' : 'var(--nd-text-secondary)',
                  }}>
                    {n.type === 'warning' ? <AlertTriangle size={14} strokeWidth={1.5} /> :
                     n.type === 'success' ? <CheckCircle size={14} strokeWidth={1.5} /> :
                     <Info size={14} strokeWidth={1.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '13px', color: 'var(--nd-text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--nd-text-secondary)' }} className="truncate">{n.message}</div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: 'var(--nd-text-disabled)',
                      letterSpacing: '0.04em',
                      marginTop: '4px',
                    }}>
                      {n.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 cursor-pointer transition-colors duration-150"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--nd-accent)',
                color: '#fff',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              JP
            </div>
            <div className="hidden md:block text-left">
              <div style={{ fontSize: '13px', color: 'var(--nd-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                Juan Perez
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                color: 'var(--nd-text-disabled)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                TESORERO
              </div>
            </div>
            <ChevronDown size={14} className="hidden md:block" style={{ color: 'var(--nd-text-disabled)' }} strokeWidth={1.5} />
          </button>
          {userMenuOpen && (
            <div
              className="absolute right-0 top-12 w-48 py-1 overflow-hidden"
              style={{
                background: 'var(--nd-surface-raised)',
                border: '1px solid var(--nd-border-visible)',
                borderRadius: '8px',
              }}
            >
              {[
                { icon: User, label: 'MI PERFIL', action: () => { navigate('/configuracion'); setUserMenuOpen(false); } },
                { icon: Settings, label: 'CONFIG', action: () => { navigate('/configuracion'); setUserMenuOpen(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors duration-150"
                  style={{ color: 'var(--nd-text-secondary)' }}
                >
                  <item.icon size={14} strokeWidth={1.5} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.06em' }}>{item.label}</span>
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--nd-border)', margin: '4px 0' }} />
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer"
                style={{ color: 'var(--nd-accent)' }}
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', letterSpacing: '0.06em' }}>SALIR</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
