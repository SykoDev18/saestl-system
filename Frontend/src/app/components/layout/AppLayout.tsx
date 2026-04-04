import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { FinancialPrivacyProvider } from '../FinancialPrivacyContext';
import { useAuth } from '../AuthContext';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--nd-black)' }}>
        <span style={{ color: 'var(--nd-text-secondary)', fontFamily: "'Space Mono', monospace", fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>[LOADING...]</span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <FinancialPrivacyProvider>
      <div
        className="min-h-screen"
        style={{ background: 'var(--nd-black)', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Header
          sidebarCollapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main
          className={`pt-[56px] min-h-screen transition-all duration-200 pb-20 lg:pb-8
            ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'}
          `}
          style={{ background: 'var(--nd-black)' }}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </FinancialPrivacyProvider>
  );
}
