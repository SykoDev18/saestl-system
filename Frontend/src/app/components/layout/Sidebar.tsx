import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, ArrowLeftRight, Ticket, CalendarDays,
  Wallet, FileText, BarChart3, Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import saestiLogo from '../../../assets/saestl-logo.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ArrowLeftRight, label: 'Transacciones', path: '/transacciones' },
  { icon: Ticket, label: 'Rifas', path: '/rifas' },
  { icon: CalendarDays, label: 'Eventos', path: '/eventos' },
  { icon: Wallet, label: 'Presupuestos', path: '/presupuestos' },
  { icon: FileText, label: 'Cuentas', path: '/cuentas' },
  { icon: BarChart3, label: 'Reportes', path: '/reportes' },
  { icon: Settings, label: 'Config', path: '/configuracion' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-200 flex flex-col
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'var(--nd-surface)',
          borderRight: '1px solid var(--nd-border)',
        }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-[56px] px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}
          style={{ borderBottom: '1px solid var(--nd-border)' }}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={saestiLogo} alt="SAESTL" className="w-8 h-8 object-contain" />
              <span style={{
                fontFamily: "'Doto', 'Space Mono', monospace",
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--nd-text-display)',
                letterSpacing: '-0.02em',
              }}>
                SAESTL
              </span>
            </div>
          )}
          {collapsed && (
            <img src={saestiLogo} alt="SAESTL" className="w-8 h-8 object-contain" />
          )}
          <button
            onClick={onMobileClose}
            className="lg:hidden cursor-pointer"
            style={{ color: 'var(--nd-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 h-10 transition-all duration-150 cursor-pointer
                  ${collapsed ? 'justify-center px-0 rounded-lg' : 'px-3 rounded-lg'}
                `}
                style={{
                  background: active ? 'var(--nd-surface-raised)' : 'transparent',
                  borderLeft: active ? '2px solid var(--nd-accent)' : '2px solid transparent',
                  color: active ? 'var(--nd-text-display)' : 'var(--nd-text-secondary)',
                }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className="shrink-0" strokeWidth={1.5} />
                {!collapsed && (
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '12px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex p-3" style={{ borderTop: '1px solid var(--nd-border)' }}>
          <button
            onClick={onToggle}
            className={`w-full flex items-center gap-3 h-9 rounded-lg transition-all cursor-pointer
              ${collapsed ? 'justify-center' : 'px-3'}
            `}
            style={{ color: 'var(--nd-text-disabled)' }}
          >
            {collapsed ? <ChevronRight size={16} strokeWidth={1.5} /> : (
              <>
                <ChevronLeft size={16} strokeWidth={1.5} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  COLAPSAR
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
