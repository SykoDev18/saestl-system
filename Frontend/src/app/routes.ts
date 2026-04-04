import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { RifasPage } from './pages/RifasPage';
import { EventsPage } from './pages/EventsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AccountsPage } from './pages/AccountsPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'transacciones', Component: TransactionsPage },
      { path: 'rifas', Component: RifasPage },
      { path: 'eventos', Component: EventsPage },
      { path: 'presupuestos', Component: BudgetsPage },
      { path: 'cuentas', Component: AccountsPage },
      { path: 'reportes', Component: ReportsPage },
      { path: 'configuracion', Component: SettingsPage },
    ],
  },
]);
