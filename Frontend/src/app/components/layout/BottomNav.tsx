import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, ArrowLeftRight, Ticket, CalendarDays, BarChart3 } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'INICIO', path: '/' },
  { icon: ArrowLeftRight, label: 'TRANS', path: '/transacciones' },
  { icon: Ticket, label: 'RIFAS', path: '/rifas' },
  { icon: CalendarDays, label: 'EVENTOS', path: '/eventos' },
  { icon: BarChart3, label: 'MAS', path: '/reportes' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-30"
      style={{
        background: 'var(--nd-surface)',
        borderTop: '1px solid var(--nd-border)',
      }}
    >
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-colors duration-150"
            >
              <item.icon
                size={18}
                strokeWidth={1.5}
                style={{ color: active ? 'var(--nd-text-display)' : 'var(--nd-text-disabled)' }}
              />
              {active && (
                <div className="w-1 h-1 rounded-full" style={{ background: 'var(--nd-accent)' }} />
              )}
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.08em',
                color: active ? 'var(--nd-text-display)' : 'var(--nd-text-disabled)',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
