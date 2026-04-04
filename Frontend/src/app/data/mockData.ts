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

export interface Budget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  category: string;
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

export const transactions: Transaction[] = [
  { id: '1', date: '2026-03-15', type: 'ingreso', category: 'Cuotas', description: 'Cuotas de Alumnos - Marzo', responsible: 'Juan Pérez', amount: 2500, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '2', date: '2026-03-14', type: 'egreso', category: 'Materiales', description: 'Compra de materiales para evento', responsible: 'María García', amount: 850, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '3', date: '2026-03-13', type: 'ingreso', category: 'Rifas', description: 'Venta de boletos - Rifa iPhone', responsible: 'Carlos López', amount: 1500, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '4', date: '2026-03-12', type: 'egreso', category: 'Servicios', description: 'Pago DJ para fiesta de bienvenida', responsible: 'Ana Martínez', amount: 3000, status: 'pendiente', metodoPago: 'Transferencia' },
  { id: '5', date: '2026-03-11', type: 'ingreso', category: 'Eventos', description: 'Entradas Torneo Deportivo', responsible: 'Juan Pérez', amount: 4200, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '6', date: '2026-03-10', type: 'egreso', category: 'Alimentos', description: 'Catering para reunión de bienvenida', responsible: 'María García', amount: 1200, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '7', date: '2026-03-09', type: 'ingreso', category: 'Patrocinios', description: 'Patrocinio empresa XYZ', responsible: 'Carlos López', amount: 5000, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '8', date: '2026-03-08', type: 'egreso', category: 'Equipamiento', description: 'Compra de equipo audiovisual', responsible: 'Juan Pérez', amount: 1500, status: 'rechazado', metodoPago: 'Tarjeta' },
  { id: '9', date: '2026-03-07', type: 'ingreso', category: 'Cuotas', description: 'Cuotas de alumnos rezagados', responsible: 'Ana Martínez', amount: 800, status: 'pendiente', metodoPago: 'Efectivo' },
  { id: '10', date: '2026-03-06', type: 'egreso', category: 'Transporte', description: 'Renta de autobús para viaje', responsible: 'Carlos López', amount: 2800, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '11', date: '2026-03-05', type: 'ingreso', category: 'Rifas', description: 'Venta boletos - Rifa Laptop', responsible: 'María García', amount: 3500, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '12', date: '2026-03-04', type: 'egreso', category: 'Impresión', description: 'Impresión de carteles y volantes', responsible: 'Ana Martínez', amount: 450, status: 'aprobado', metodoPago: 'Efectivo' },
  { id: '13', date: '2026-03-03', type: 'ingreso', category: 'Eventos', description: 'Inscripciones Hackathon UAEH', responsible: 'Juan Pérez', amount: 1800, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '14', date: '2026-03-02', type: 'egreso', category: 'Servicios', description: 'Diseño gráfico imagen semestral', responsible: 'María García', amount: 1500, status: 'aprobado', metodoPago: 'Transferencia' },
  { id: '15', date: '2026-03-01', type: 'ingreso', category: 'Cuotas', description: 'Cuotas extemporáneas Febrero', responsible: 'Ana Martínez', amount: 1200, status: 'pendiente', metodoPago: 'Efectivo' },
];

function generateTickets(total: number, sold: number): TicketInfo[] {
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
      soldDate: isSold ? '2026-03-10' : undefined,
      paid: isSold ? Math.random() > 0.2 : false,
    });
  }
  return tickets;
}

export const rifas: Rifa[] = [
  {
    id: '1', name: 'iPhone 15 Pro Max', description: 'Smartphone Apple último modelo, 256GB', prize: 'iPhone 15 Pro Max 256GB',
    pricePerTicket: 50, totalTickets: 300, soldTickets: 245, startDate: '2026-01-15', endDate: '2026-03-30', drawDate: '2026-03-30',
    status: 'activa', createdBy: 'Juan Pérez', tickets: generateTickets(300, 245),
  },
  {
    id: '2', name: 'Laptop HP Pavilion', description: 'Laptop HP Pavilion 15, Ryzen 5, 16GB RAM', prize: 'Laptop HP Pavilion 15',
    pricePerTicket: 30, totalTickets: 200, soldTickets: 200, startDate: '2026-01-01', endDate: '2026-02-28', drawDate: '2026-02-28',
    status: 'sorteada', createdBy: 'María García', winner: { name: 'Pedro Sánchez', phone: '771-234-5678', ticket: 42 },
    tickets: generateTickets(200, 200),
  },
  {
    id: '3', name: 'Audífonos AirPods Pro', description: 'Audífonos Apple AirPods Pro 2da generación', prize: 'AirPods Pro 2',
    pricePerTicket: 20, totalTickets: 150, soldTickets: 89, startDate: '2026-03-01', endDate: '2026-04-15', drawDate: '2026-04-15',
    status: 'activa', createdBy: 'Carlos López', tickets: generateTickets(150, 89),
  },
  {
    id: '4', name: 'Smart TV 55"', description: 'Smart TV Samsung 55 pulgadas 4K', prize: 'Samsung Smart TV 55" 4K',
    pricePerTicket: 40, totalTickets: 250, soldTickets: 250, startDate: '2025-11-01', endDate: '2025-12-20', drawDate: '2025-12-20',
    status: 'sorteada', createdBy: 'Ana Martínez', winner: { name: 'Laura Torres', phone: '771-987-6543', ticket: 178 },
    tickets: generateTickets(250, 250),
  },
];

export const events: Event[] = [
  {
    id: '1', name: 'Torneo de Fútbol Rápido', description: 'Gran torneo interfacultades de fútbol rápido. Forma tu equipo de 5 jugadores y 2 suplentes para competir por el campeonato. Premios para los 3 primeros lugares.',
    date: '2026-03-20', time: '10:00', endTime: '14:00', location: 'Cancha Principal', address: 'Av. Universidad s/n, Tlahuelilpan',
    type: 'deportivo', registered: 48, capacity: 64, budget: 5000, status: 'proximo',
    cost: 50, costPer: 'equipo', registrationDeadline: '2026-03-18', organizer: 'Juan Pérez',
    requirements: ['Equipo de 5 jugadores + 2 suplentes', 'Identificación oficial', 'Traer tenis deportivos y agua'],
    notes: 'No se permiten bebidas alcohólicas. Juego limpio obligatorio.',
    participants: [
      { id: 'p1', name: 'Juan Pérez', email: 'juan@uaeh.edu.mx', phone: '771-123-4567', team: 'Los Tigres', registrationDate: '2026-03-10', registrationNumber: '#TF-2026-001', paymentStatus: 'pagado', attended: false },
      { id: 'p2', name: 'María García', email: 'maria@uaeh.edu.mx', phone: '771-234-5678', team: 'Las Águilas', registrationDate: '2026-03-11', registrationNumber: '#TF-2026-002', paymentStatus: 'pagado', attended: false },
      { id: 'p3', name: 'Carlos López', email: 'carlos@uaeh.edu.mx', phone: '771-345-6789', team: 'Los Lobos', registrationDate: '2026-03-12', registrationNumber: '#TF-2026-003', paymentStatus: 'pendiente', attended: false },
      { id: 'p4', name: 'Ana Martínez', email: 'ana@uaeh.edu.mx', phone: '771-456-7890', team: 'Las Panteras', registrationDate: '2026-03-13', registrationNumber: '#TF-2026-004', paymentStatus: 'pagado', attended: false },
      { id: 'p5', name: 'Pedro Sánchez', email: 'pedro@uaeh.edu.mx', phone: '771-567-8901', team: 'Los Halcones', registrationDate: '2026-03-14', registrationNumber: '#TF-2026-005', paymentStatus: 'vencido', attended: false },
    ],
  },
  {
    id: '2', name: 'Feria de Ciencias', description: 'Exposición de proyectos de investigación de todas las carreras. Los mejores proyectos serán premiados y podrán representar a la escuela en la feria regional.',
    date: '2026-03-25', time: '09:00', endTime: '17:00', location: 'Auditorio Principal', address: 'Edificio A, ESTL',
    type: 'academico', registered: 120, capacity: 200, budget: 8000, status: 'proximo',
    cost: 0, registrationDeadline: '2026-03-22', organizer: 'Dra. Laura Torres',
    requirements: ['Proyecto de investigación documentado', 'Poster científico tamaño A1', 'Presentación de máximo 10 minutos'],
    participants: [
      { id: 'p6', name: 'Sofia Ramírez', email: 'sofia@uaeh.edu.mx', phone: '771-678-9012', registrationDate: '2026-03-01', registrationNumber: '#FC-2026-001', paymentStatus: 'pagado', attended: false },
      { id: 'p7', name: 'Diego Flores', email: 'diego@uaeh.edu.mx', phone: '771-789-0123', registrationDate: '2026-03-02', registrationNumber: '#FC-2026-002', paymentStatus: 'pagado', attended: false },
    ],
  },
  {
    id: '3', name: 'Noche Cultural', description: 'Presentaciones artísticas y culturales incluyendo danza, música, teatro y poesía. Evento abierto a toda la comunidad universitaria.',
    date: '2026-04-05', time: '18:00', endTime: '22:00', location: 'Explanada', address: 'Explanada central, ESTL',
    type: 'cultural', registered: 85, capacity: 150, budget: 12000, status: 'proximo',
    cost: 30, costPer: 'persona', registrationDeadline: '2026-04-03', organizer: 'María García',
    requirements: ['Propuesta artística aprobada por comité', 'Ensayo general obligatorio el 4 de abril'],
    participants: [],
  },
  {
    id: '4', name: 'Fiesta de Bienvenida', description: 'Bienvenida a nuevos alumnos del semestre 2026. Música en vivo, comida, rifas y actividades de integración.',
    date: '2026-02-15', time: '19:00', endTime: '23:00', location: 'Salón de Eventos', address: 'Salón de Eventos ESTL',
    type: 'social', registered: 200, capacity: 200, budget: 15000, status: 'finalizado',
    cost: 100, costPer: 'persona', organizer: 'Carlos López',
    participants: [
      { id: 'p8', name: 'Luis Hernández', email: 'luis@uaeh.edu.mx', phone: '771-890-1234', registrationDate: '2026-02-01', registrationNumber: '#FB-2026-001', paymentStatus: 'pagado', attended: true },
      { id: 'p9', name: 'Rosa Mendoza', email: 'rosa@uaeh.edu.mx', phone: '771-901-2345', registrationDate: '2026-02-03', registrationNumber: '#FB-2026-002', paymentStatus: 'pagado', attended: true },
    ],
  },
  {
    id: '5', name: 'Hackathon UAEH', description: 'Competencia de programación de 24 horas. Desarrolla soluciones tecnológicas para problemas reales de la comunidad.',
    date: '2026-04-12', time: '08:00', endTime: '08:00', location: 'Lab. Cómputo', address: 'Edificio B, Laboratorio 3',
    type: 'academico', registered: 30, capacity: 50, budget: 3000, status: 'proximo',
    cost: 0, registrationDeadline: '2026-04-10', organizer: 'Ing. Pedro Sánchez',
    requirements: ['Laptop personal', 'Equipo de 3-4 personas', 'Conocimientos básicos de programación'],
    participants: [],
  },
  {
    id: '6', name: 'Conferencia de Emprendimiento', description: 'Ponencia magistral sobre emprendimiento juvenil con casos de éxito de exalumnos UAEH.',
    date: '2026-03-28', time: '11:00', endTime: '13:00', location: 'Auditorio Principal', address: 'Edificio A, ESTL',
    type: 'academico', registered: 65, capacity: 100, budget: 2000, status: 'proximo',
    cost: 0, organizer: 'Lic. Ana Martínez',
    participants: [],
  },
  {
    id: '7', name: 'Carrera Atlética 5K', description: 'Carrera atlética abierta a toda la comunidad universitaria. Recorrido por el campus y alrededores.',
    date: '2026-03-15', time: '07:00', endTime: '10:00', location: 'Entrada Principal', address: 'Entrada Principal ESTL',
    type: 'deportivo', registered: 90, capacity: 120, budget: 4000, status: 'en_curso',
    cost: 25, costPer: 'persona', organizer: 'Juan Pérez',
    participants: [],
  },
  {
    id: '8', name: 'Día de Muertos', description: 'Exposición de altares y concurso de calaveritas literarias. Venta de pan de muerto y chocolate.',
    date: '2026-11-02', time: '10:00', endTime: '18:00', location: 'Explanada', address: 'Explanada central, ESTL',
    type: 'cultural', registered: 0, capacity: 300, budget: 6000, status: 'proximo',
    cost: 0, organizer: 'María García',
    participants: [],
  },
];

export const budgets: Budget[] = [
  { id: '1', name: 'Eventos Sociales', allocated: 15000, spent: 12500, category: 'Eventos' },
  { id: '2', name: 'Eventos Académicos', allocated: 8000, spent: 3200, category: 'Eventos' },
  { id: '3', name: 'Materiales y Equipo', allocated: 5000, spent: 4200, category: 'Operación' },
  { id: '4', name: 'Transporte', allocated: 6000, spent: 2800, category: 'Operación' },
  { id: '5', name: 'Publicidad y Marketing', allocated: 3000, spent: 1450, category: 'Operación' },
  { id: '6', name: 'Fondo de Emergencia', allocated: 10000, spent: 0, category: 'Reserva' },
];

export const chartData = {
  monthly: [
    { month: 'Oct', ingresos: 6500, egresos: 4200 },
    { month: 'Nov', ingresos: 8200, egresos: 5100 },
    { month: 'Dic', ingresos: 9800, egresos: 7200 },
    { month: 'Ene', ingresos: 7500, egresos: 3800 },
    { month: 'Feb', ingresos: 8750, egresos: 4500 },
    { month: 'Mar', ingresos: 10200, egresos: 3200 },
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
  { id: '2', title: 'Rifa por cerrar', message: 'Rifa iPhone 15 Pro cierra en 14 días', time: 'Hace 1 hora', read: false, type: 'info' },
  { id: '3', title: 'Nuevo registro', message: '5 alumnos se registraron al Torneo de Fútbol', time: 'Hace 3 horas', read: true, type: 'success' },
  { id: '4', title: 'Cuenta por vencer', message: 'Diseño de imagen semestral vence el 10 Mar', time: 'Hace 6 horas', read: false, type: 'warning' },
  { id: '5', title: 'Presupuesto al límite', message: 'Eventos Sociales al 83% de ejecución', time: 'Hace 1 día', read: true, type: 'warning' },
];

export const cuentas: Cuenta[] = [
  { id: '1', description: 'Renta de sonido para evento', amount: 3500, dueDate: '2026-03-25', status: 'pendiente', supplier: 'Audio Pro MX', category: 'Servicios' },
  { id: '2', description: 'Impresión de playeras', amount: 4800, dueDate: '2026-03-20', status: 'pendiente', supplier: 'Imprenta Express', category: 'Materiales' },
  { id: '3', description: 'Catering fiesta bienvenida', amount: 6000, dueDate: '2026-02-28', status: 'pagado', supplier: 'Banquetes Diana', category: 'Alimentos' },
  { id: '4', description: 'Diseño de imagen semestral', amount: 1500, dueDate: '2026-03-10', status: 'vencido', supplier: 'Freelancer Design', category: 'Servicios' },
  { id: '5', description: 'Trofeos torneo deportivo', amount: 2200, dueDate: '2026-03-30', status: 'pendiente', supplier: 'Trofeos y Medallas', category: 'Materiales' },
];