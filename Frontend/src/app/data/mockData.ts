export interface Transaction {
  id: string;
  date: string;
  type: 'ingreso' | 'egreso';
  category: string;
  description: string;
  responsible: string;
  amount: number;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta';
}

export interface Rifa {
  id: string;
  name: string;
  description: string;
  prize: string;
  pricePerTicket: number;
  totalTickets: number;
  soldTickets: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: 'activa' | 'cerrada' | 'sorteada';
  createdBy: string;
  winner?: { name: string; phone: string; ticket: number };
  tickets: TicketInfo[];
}

export interface TicketInfo {
  number: number;
  sold: boolean;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  soldBy?: string;
  soldDate?: string;
  paid: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address?: string;
  mapsLink?: string;
  type: 'academico' | 'social' | 'deportivo' | 'cultural';
  registered: number;
  capacity: number;
  budget: number;
  status: 'proximo' | 'en_curso' | 'finalizado' | 'cancelado';
  cost?: number;
  costPer?: 'persona' | 'equipo';
  registrationDeadline?: string;
  organizer?: string;
  requirements?: string[];
  notes?: string;
  participants?: EventParticipant[];
}

export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  phone: string;
  team?: string;
  registrationDate: string;
  registrationNumber: string;
  paymentStatus: 'pagado' | 'pendiente' | 'vencido';
  attended?: boolean;
}

export interface GastoRegistro {
  id: string;
  monto: number;
  descripcion: string;
  fecha: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  category: string;
  mes: number;
  anio: number;
  gastos: GastoRegistro[];
}

export interface Cuenta {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pendiente' | 'pagado' | 'vencido';
  supplier: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'warning' | 'info' | 'success';
}

// ── Helpers para fechas dinámicas relativas a hoy ──
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth() + 1; // 1-12

function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function monthsAgo(n: number): { mes: number; anio: number } {
  const d = new Date(TODAY);
  d.setMonth(d.getMonth() - n);
  return { mes: d.getMonth() + 1, anio: d.getFullYear() };
}

function gastoDate(daysBack: number): { fecha: string; createdAt: string } {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysBack);
  const fecha = d.toISOString().split('T')[0];
  return { fecha, createdAt: d.toISOString() };
}

const currentMonthName = TODAY.toLocaleDateString('es-MX', { month: 'long' }).replace(/^\w/, c => c.toUpperCase());
const prevMonth = monthsAgo(1);

export const transactions: Transaction[] = [
  { id: '1', date: daysAgo(0), type: 'ingreso', category: 'Cuotas', description: `Cuotas de Alumnos - ${currentMonthName}`, responsible: 'Juan Pérez', amount: 2500, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '2', date: daysAgo(1), type: 'egreso', category: 'Materiales', description: 'Compra de materiales para evento', responsible: 'María García', amount: 850, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '3', date: daysAgo(2), type: 'ingreso', category: 'Rifas', description: 'Venta de boletos - Rifa iPhone', responsible: 'Carlos López', amount: 1500, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '4', date: daysAgo(3), type: 'egreso', category: 'Servicios', description: 'Pago DJ para fiesta de bienvenida', responsible: 'Ana Martínez', amount: 3000, status: 'pendiente', metodoPago: 'Transferencia' },
  { id: '5', date: daysAgo(4), type: 'ingreso', category: 'Eventos', description: 'Entradas Torneo Deportivo', responsible: 'Juan Pérez', amount: 4200, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '6', date: daysAgo(5), type: 'egreso', category: 'Alimentos', description: 'Catering para reunión de bienvenida', responsible: 'María García', amount: 1200, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '7', date: daysAgo(6), type: 'ingreso', category: 'Patrocinios', description: 'Patrocinio empresa XYZ', responsible: 'Carlos López', amount: 5000, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '8', date: daysAgo(7), type: 'egreso', category: 'Equipamiento', description: 'Compra de equipo audiovisual', responsible: 'Juan Pérez', amount: 1500, status: 'rechazado', metodoPago: 'Tarjeta' },
  { id: '9', date: daysAgo(8), type: 'ingreso', category: 'Cuotas', description: 'Cuotas de alumnos rezagados', responsible: 'Ana Martínez', amount: 800, status: 'pendiente', metodoPago: 'Efectivo' },
  { id: '10', date: daysAgo(10), type: 'egreso', category: 'Transporte', description: 'Renta de autobús para viaje', responsible: 'Carlos López', amount: 2800, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '11', date: daysAgo(12), type: 'ingreso', category: 'Rifas', description: 'Venta boletos - Rifa Laptop', responsible: 'María García', amount: 3500, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '12', date: daysAgo(14), type: 'egreso', category: 'Impresión', description: 'Impresión de carteles y volantes', responsible: 'Ana Martínez', amount: 450, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '13', date: daysAgo(16), type: 'ingreso', category: 'Eventos', description: 'Inscripciones Hackathon UAEH', responsible: 'Juan Pérez', amount: 1800, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '14', date: daysAgo(18), type: 'egreso', category: 'Servicios', description: 'Diseño gráfico imagen semestral', responsible: 'María García', amount: 1500, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '15', date: daysAgo(20), type: 'ingreso', category: 'Cuotas', description: 'Cuotas extemporáneas mes anterior', responsible: 'Ana Martínez', amount: 1200, status: 'pendiente', metodoPago: 'Efectivo' },
];

function generateTickets(total: number, sold: number, soldDateStr?: string): TicketInfo[] {
  const names = ['Luis Hernández', 'Rosa Mendoza', 'Pedro Sánchez', 'Laura Torres', 'Miguel Ángel', 'Sofia Ramírez', 'Diego Flores', 'Camila Ruiz'];
  const tickets: TicketInfo[] = [];
  const soldNumbers = new Set<number>();
  while (soldNumbers.size < sold) {
    soldNumbers.add(Math.floor(Math.random() * total) + 1);
  }
  for (let i = 1; i <= total; i++) {
    const isSold = soldNumbers.has(i);
    tickets.push({
      number: i,
      sold: isSold,
      buyerName: isSold ? names[Math.floor(Math.random() * names.length)] : undefined,
      buyerPhone: isSold ? `771-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      buyerEmail: isSold ? `alumno${i}@uaeh.edu.mx` : undefined,
      soldBy: isSold ? 'Juan Pérez' : undefined,
      soldDate: isSold ? (soldDateStr || daysAgo(5)) : undefined,
      paid: isSold ? Math.random() > 0.2 : false,
    });
  }
  return tickets;
}

export const rifas: Rifa[] = [
  {
    id: '1', name: 'iPhone 15 Pro Max', description: 'Smartphone Apple último modelo, 256GB', prize: 'iPhone 15 Pro Max 256GB',
    pricePerTicket: 50, totalTickets: 300, soldTickets: 245, startDate: daysAgo(60), endDate: daysFromNow(15), drawDate: daysFromNow(15),
    status: 'activa', createdBy: 'Juan Pérez', tickets: generateTickets(300, 245, daysAgo(5)),
  },
  {
    id: '2', name: 'Laptop HP Pavilion', description: 'Laptop HP Pavilion 15, Ryzen 5, 16GB RAM', prize: 'Laptop HP Pavilion 15',
    pricePerTicket: 30, totalTickets: 200, soldTickets: 200, startDate: daysAgo(120), endDate: daysAgo(30), drawDate: daysAgo(30),
    status: 'sorteada', createdBy: 'María García', winner: { name: 'Pedro Sánchez', phone: '771-234-5678', ticket: 42 },
    tickets: generateTickets(200, 200, daysAgo(35)),
  },
  {
    id: '3', name: 'Audífonos AirPods Pro', description: 'Audífonos Apple AirPods Pro 2da generación', prize: 'AirPods Pro 2',
    pricePerTicket: 20, totalTickets: 150, soldTickets: 89, startDate: daysAgo(30), endDate: daysFromNow(25), drawDate: daysFromNow(25),
    status: 'activa', createdBy: 'Carlos López', tickets: generateTickets(150, 89, daysAgo(3)),
  },
  {
    id: '4', name: 'Smart TV 55"', description: 'Smart TV Samsung 55 pulgadas 4K', prize: 'Samsung Smart TV 55" 4K',
    pricePerTicket: 40, totalTickets: 250, soldTickets: 250, startDate: daysAgo(180), endDate: daysAgo(100), drawDate: daysAgo(100),
    status: 'sorteada', createdBy: 'Ana Martínez', winner: { name: 'Laura Torres', phone: '771-987-6543', ticket: 178 },
    tickets: generateTickets(250, 250, daysAgo(105)),
  },
];

export const events: Event[] = [
  {
    id: '1', name: 'Torneo de Fútbol Rápido', description: 'Gran torneo interfacultades de fútbol rápido. Forma tu equipo de 5 jugadores y 2 suplentes para competir por el campeonato. Premios para los 3 primeros lugares.',
    date: daysFromNow(5), time: '10:00', endTime: '14:00', location: 'Cancha Principal', address: 'Av. Universidad s/n, Tlahuelilpan',
    type: 'deportivo', registered: 48, capacity: 64, budget: 5000, status: 'proximo',
    cost: 50, costPer: 'equipo', registrationDeadline: daysFromNow(3), organizer: 'Juan Pérez',
    requirements: ['Equipo de 5 jugadores + 2 suplentes', 'Identificación oficial', 'Traer tenis deportivos y agua'],
    notes: 'No se permiten bebidas alcohólicas. Juego limpio obligatorio.',
    participants: [
      { id: 'p1', name: 'Juan Pérez', email: 'juan@uaeh.edu.mx', phone: '771-123-4567', team: 'Los Tigres', registrationDate: daysAgo(10), registrationNumber: '#TF-2026-001', paymentStatus: 'pagado', attended: false },
      { id: 'p2', name: 'María García', email: 'maria@uaeh.edu.mx', phone: '771-234-5678', team: 'Las Águilas', registrationDate: daysAgo(9), registrationNumber: '#TF-2026-002', paymentStatus: 'pagado', attended: false },
      { id: 'p3', name: 'Carlos López', email: 'carlos@uaeh.edu.mx', phone: '771-345-6789', team: 'Los Lobos', registrationDate: daysAgo(8), registrationNumber: '#TF-2026-003', paymentStatus: 'pendiente', attended: false },
      { id: 'p4', name: 'Ana Martínez', email: 'ana@uaeh.edu.mx', phone: '771-456-7890', team: 'Las Panteras', registrationDate: daysAgo(7), registrationNumber: '#TF-2026-004', paymentStatus: 'pagado', attended: false },
      { id: 'p5', name: 'Pedro Sánchez', email: 'pedro@uaeh.edu.mx', phone: '771-567-8901', team: 'Los Halcones', registrationDate: daysAgo(6), registrationNumber: '#TF-2026-005', paymentStatus: 'vencido', attended: false },
    ],
  },
  {
    id: '2', name: 'Feria de Ciencias', description: 'Exposición de proyectos de investigación de todas las carreras. Los mejores proyectos serán premiados y podrán representar a la escuela en la feria regional.',
    date: daysFromNow(10), time: '09:00', endTime: '17:00', location: 'Auditorio Principal', address: 'Edificio A, ESTL',
    type: 'academico', registered: 120, capacity: 200, budget: 8000, status: 'proximo',
    cost: 0, registrationDeadline: daysFromNow(7), organizer: 'Dra. Laura Torres',
    requirements: ['Proyecto de investigación documentado', 'Poster científico tamaño A1', 'Presentación de máximo 10 minutos'],
    participants: [
      { id: 'p6', name: 'Sofia Ramírez', email: 'sofia@uaeh.edu.mx', phone: '771-678-9012', registrationDate: daysAgo(15), registrationNumber: '#FC-2026-001', paymentStatus: 'pagado', attended: false },
      { id: 'p7', name: 'Diego Flores', email: 'diego@uaeh.edu.mx', phone: '771-789-0123', registrationDate: daysAgo(14), registrationNumber: '#FC-2026-002', paymentStatus: 'pagado', attended: false },
    ],
  },
  {
    id: '3', name: 'Noche Cultural', description: 'Presentaciones artísticas y culturales incluyendo danza, música, teatro y poesía. Evento abierto a toda la comunidad universitaria.',
    date: daysFromNow(2), time: '18:00', endTime: '22:00', location: 'Explanada', address: 'Explanada central, ESTL',
    type: 'cultural', registered: 85, capacity: 150, budget: 12000, status: 'proximo',
    cost: 30, costPer: 'persona', registrationDeadline: daysAgo(1), organizer: 'María García',
    requirements: ['Propuesta artística aprobada por comité', 'Ensayo general obligatorio el día previo'],
    participants: [],
  },
  {
    id: '4', name: 'Fiesta de Bienvenida', description: 'Bienvenida a nuevos alumnos del semestre. Música en vivo, comida, rifas y actividades de integración.',
    date: daysAgo(45), time: '19:00', endTime: '23:00', location: 'Salón de Eventos', address: 'Salón de Eventos ESTL',
    type: 'social', registered: 200, capacity: 200, budget: 15000, status: 'finalizado',
    cost: 100, costPer: 'persona', organizer: 'Carlos López',
    participants: [
      { id: 'p8', name: 'Luis Hernández', email: 'luis@uaeh.edu.mx', phone: '771-890-1234', registrationDate: daysAgo(60), registrationNumber: '#FB-2026-001', paymentStatus: 'pagado', attended: true },
      { id: 'p9', name: 'Rosa Mendoza', email: 'rosa@uaeh.edu.mx', phone: '771-901-2345', registrationDate: daysAgo(58), registrationNumber: '#FB-2026-002', paymentStatus: 'pagado', attended: true },
    ],
  },
  {
    id: '5', name: 'Hackathon UAEH', description: 'Competencia de programación de 24 horas. Desarrolla soluciones tecnológicas para problemas reales de la comunidad.',
    date: daysFromNow(20), time: '08:00', endTime: '08:00', location: 'Lab. Cómputo', address: 'Edificio B, Laboratorio 3',
    type: 'academico', registered: 30, capacity: 50, budget: 3000, status: 'proximo',
    cost: 0, registrationDeadline: daysFromNow(18), organizer: 'Ing. Pedro Sánchez',
    requirements: ['Laptop personal', 'Equipo de 3-4 personas', 'Conocimientos básicos de programación'],
    participants: [],
  },
  {
    id: '6', name: 'Conferencia de Emprendimiento', description: 'Ponencia magistral sobre emprendimiento juvenil con casos de éxito de exalumnos UAEH.',
    date: daysAgo(7), time: '11:00', endTime: '13:00', location: 'Auditorio Principal', address: 'Edificio A, ESTL',
    type: 'academico', registered: 65, capacity: 100, budget: 2000, status: 'finalizado',
    cost: 0, organizer: 'Lic. Ana Martínez',
    participants: [],
  },
  {
    id: '7', name: 'Carrera Atlética 5K', description: 'Carrera atlética abierta a toda la comunidad universitaria. Recorrido por el campus y alrededores.',
    date: daysAgo(20), time: '07:00', endTime: '10:00', location: 'Entrada Principal', address: 'Entrada Principal ESTL',
    type: 'deportivo', registered: 90, capacity: 120, budget: 4000, status: 'finalizado',
    cost: 25, costPer: 'persona', organizer: 'Juan Pérez',
    participants: [],
  },
  {
    id: '8', name: 'Día de Muertos', description: 'Exposición de altares y concurso de calaveritas literarias. Venta de pan de muerto y chocolate.',
    date: `${CURRENT_YEAR}-11-02`, time: '10:00', endTime: '18:00', location: 'Explanada', address: 'Explanada central, ESTL',
    type: 'cultural', registered: 0, capacity: 300, budget: 6000, status: 'proximo',
    cost: 0, organizer: 'María García',
    participants: [],
  },
];

export const budgets: Budget[] = [
  { id: '1', name: 'Eventos Sociales', allocated: 15000, spent: 12500, category: 'Eventos', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [
    { id: 'g1', monto: 5000, descripcion: 'Pago de DJ fiesta bienvenida', ...gastoDate(8) },
    { id: 'g2', monto: 3500, descripcion: 'Decoración salón de eventos', ...gastoDate(5) },
    { id: 'g3', monto: 4000, descripcion: 'Renta de mobiliario', ...gastoDate(2) },
  ]},
  { id: '2', name: 'Eventos Académicos', allocated: 8000, spent: 3200, category: 'Eventos', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [
    { id: 'g4', monto: 2000, descripcion: 'Impresión diplomas y constancias', ...gastoDate(7) },
    { id: 'g5', monto: 1200, descripcion: 'Material didáctico taller', ...gastoDate(4) },
  ]},
  { id: '3', name: 'Materiales y Equipo', allocated: 5000, spent: 4200, category: 'Operación', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [
    { id: 'g6', monto: 2700, descripcion: 'Equipo audiovisual', ...gastoDate(9) },
    { id: 'g7', monto: 1500, descripcion: 'Papelería y insumos', ...gastoDate(6) },
  ]},
  { id: '4', name: 'Transporte', allocated: 6000, spent: 2800, category: 'Operación', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [
    { id: 'g8', monto: 2800, descripcion: 'Renta autobús viaje académico', ...gastoDate(3) },
  ]},
  { id: '5', name: 'Publicidad y Marketing', allocated: 3000, spent: 1450, category: 'Operación', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [
    { id: 'g9', monto: 950, descripcion: 'Impresión carteles semestre', ...gastoDate(8) },
    { id: 'g10', monto: 500, descripcion: 'Publicidad redes sociales', ...gastoDate(1) },
  ]},
  { id: '6', name: 'Fondo de Emergencia', allocated: 10000, spent: 0, category: 'Reserva', mes: CURRENT_MONTH, anio: CURRENT_YEAR, gastos: [] },
  { id: '7', name: 'Servicios Externos', allocated: 7000, spent: 5800, category: 'Servicios', mes: prevMonth.mes, anio: prevMonth.anio, gastos: [
    { id: 'g11', monto: 3000, descripcion: 'Diseño gráfico imagen', ...gastoDate(35) },
    { id: 'g12', monto: 2800, descripcion: 'Fotografía evento', ...gastoDate(25) },
  ]},
  { id: '8', name: 'Alimentos', allocated: 4000, spent: 4500, category: 'Alimentos', mes: prevMonth.mes, anio: prevMonth.anio, gastos: [
    { id: 'g13', monto: 2500, descripcion: 'Catering reunión bienvenida', ...gastoDate(40) },
    { id: 'g14', monto: 2000, descripcion: 'Coffee break conferencia', ...gastoDate(22) },
  ]},
];

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function recentMonthLabel(monthsBack: number): string {
  const d = new Date(TODAY);
  d.setMonth(d.getMonth() - monthsBack);
  return monthNames[d.getMonth()];
}

export const chartData = {
  monthly: [
    { month: recentMonthLabel(5), ingresos: 6500, egresos: 4200 },
    { month: recentMonthLabel(4), ingresos: 8200, egresos: 5100 },
    { month: recentMonthLabel(3), ingresos: 9800, egresos: 7200 },
    { month: recentMonthLabel(2), ingresos: 7500, egresos: 3800 },
    { month: recentMonthLabel(1), ingresos: 8750, egresos: 4500 },
    { month: recentMonthLabel(0), ingresos: 10200, egresos: 3200 },
  ],
  categories: [
    { name: 'Cuotas', value: 35, fill: '#2563eb' },
    { name: 'Rifas', value: 28, fill: '#a855f7' },
    { name: 'Eventos', value: 22, fill: '#22c55e' },
    { name: 'Patrocinios', value: 15, fill: '#f59e0b' },
  ],
};

export const notifications: Notification[] = [
  { id: '1', title: 'Transacción pendiente', message: 'Pago DJ requiere aprobación - $3,000', time: 'Hace 5 min', read: false, type: 'warning' },
  { id: '2', title: 'Rifa por cerrar', message: 'Rifa iPhone 15 Pro cierra en 15 días', time: 'Hace 1 hora', read: false, type: 'info' },
  { id: '3', title: 'Nuevo registro', message: '5 alumnos se registraron al Torneo de Fútbol', time: 'Hace 3 horas', read: true, type: 'success' },
  { id: '4', title: 'Cuenta por vencer', message: 'Diseño de imagen semestral vencida hace 10 días', time: 'Hace 6 horas', read: false, type: 'warning' },
  { id: '5', title: 'Presupuesto al límite', message: 'Eventos Sociales al 83% de ejecución', time: 'Hace 1 día', read: true, type: 'warning' },
];

export const cuentas: Cuenta[] = [
  { id: '1', description: 'Renta de sonido para evento', amount: 3500, dueDate: daysFromNow(10), status: 'pendiente', supplier: 'Audio Pro MX', category: 'Servicios' },
  { id: '2', description: 'Impresión de playeras', amount: 4800, dueDate: daysFromNow(5), status: 'pendiente', supplier: 'Imprenta Express', category: 'Materiales' },
  { id: '3', description: 'Catering fiesta bienvenida', amount: 6000, dueDate: daysAgo(40), status: 'pagado', supplier: 'Banquetes Diana', category: 'Alimentos' },
  { id: '4', description: 'Diseño de imagen semestral', amount: 1500, dueDate: daysAgo(10), status: 'vencido', supplier: 'Freelancer Design', category: 'Servicios' },
  { id: '5', description: 'Trofeos torneo deportivo', amount: 2200, dueDate: daysFromNow(3), status: 'pendiente', supplier: 'Trofeos y Medallas', category: 'Materiales' },
];