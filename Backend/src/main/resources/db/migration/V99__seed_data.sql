-- ============================================================
-- V99: Datos semilla para desarrollo/pruebas
-- NOTA: La contraseña 'admin123' ya existe via DataInitializer
-- ============================================================

-- ── Usuario admin (password: admin123, BCrypt hash) ─────────
INSERT INTO users (email, password, full_name, role, active) VALUES
    ('admin@uaeh.edu.mx',
     '$2b$12$ep0X8llYeucBTIRnOJZKzuhZeyND.gUv2eCI29wIUSrXbx/szo29K',
     'Administrador SAESTL', 'ADMIN', TRUE);

-- ── Usuarios adicionales (password: test1234) ───────────────
INSERT INTO users (email, password, full_name, role, active) VALUES
    ('tesorero@uaeh.edu.mx',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'María González Tesorera', 'USER', TRUE),
    ('secretario@uaeh.edu.mx',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Carlos López Secretario', 'USER', TRUE);

-- ── Transacciones de ejemplo ────────────────────────────────
-- admin = id 1, categorías insertadas en V2

INSERT INTO transacciones (tipo, monto, descripcion, fecha, categoria_id, usuario_id) VALUES
    ('INGRESO', 5000.00, 'Cuotas del mes de enero 2026',           '2026-01-15', 1, 1),
    ('INGRESO', 1200.00, 'Donación Club de Lectura',               '2026-02-03', 2, 1),
    ('EGRESO',  350.00,  'Compra de hojas y tóner',                '2026-02-10', 6, 1),
    ('EGRESO',  800.00,  'Transporte para visita Pachuca',         '2026-02-14', 7, 1),
    ('INGRESO', 3500.00, 'Venta de boletos rifa primavera',        '2026-03-01', 3, 1),
    ('EGRESO',  450.00,  'Alimentos para junta de delegados',      '2026-03-05', 8, 1),
    ('INGRESO', 2000.00, 'Cuotas atrasadas de febrero',            '2026-03-10', 1, 1);

-- ── Evento de ejemplo ───────────────────────────────────────
INSERT INTO eventos (nombre, descripcion, fecha, lugar, activo, usuario_id) VALUES
    ('Semana de Ingeniería 2026',
     'Evento académico con conferencias, talleres y actividades culturales.',
     '2026-04-21 09:00:00', 'Auditorio Principal EST Tlahuelilpan', TRUE, 1),
    ('Kermés Día del Estudiante',
     'Kermés con venta de alimentos y juegos para celebrar el día del estudiante.',
     '2026-05-23 10:00:00', 'Explanada principal', TRUE, 1);

-- ── Asistentes al evento 1 ──────────────────────────────────
INSERT INTO asistentes_evento (evento_id, nombre, email, pago, monto) VALUES
    (1, 'Ana Martínez',     'ana.mtz@uaeh.edu.mx',    TRUE,  100.00),
    (1, 'Pedro Ramírez',    'pedro.ram@uaeh.edu.mx',  TRUE,  100.00),
    (1, 'Lucía Hernández',  'lucia.hdz@uaeh.edu.mx',  FALSE,   0.00),
    (1, 'Roberto Sánchez',  'roberto.s@uaeh.edu.mx',  TRUE,  100.00);

-- ── Rifa de ejemplo ─────────────────────────────────────────
INSERT INTO rifas (nombre, descripcion, precio_boleto, fecha_sorteo, activo, usuario_id) VALUES
    ('Rifa de Primavera 2026',
     'Gran rifa con premios: bocina bluetooth, audífonos inalámbricos y gift card.',
     50.00, '2026-04-30 14:00:00', TRUE, 1);

-- ── Boletos de la rifa 1 ────────────────────────────────────
INSERT INTO boletos_rifa (rifa_id, numero, comprador_nombre, comprador_contacto, pagado, ganador) VALUES
    (1,  1, 'Ana Martínez',    'ana.mtz@uaeh.edu.mx',    TRUE,  FALSE),
    (1,  2, 'Pedro Ramírez',   'pedro.ram@uaeh.edu.mx',  TRUE,  FALSE),
    (1,  3, 'Lucía Hernández', 'lucia.hdz@uaeh.edu.mx',  TRUE,  FALSE),
    (1,  4, NULL,               NULL,                     FALSE, FALSE),
    (1,  5, 'Jorge Flores',    '7711234567',              TRUE,  FALSE),
    (1,  6, NULL,               NULL,                     FALSE, FALSE),
    (1,  7, 'Karla Díaz',     'karla.diaz@gmail.com',    TRUE,  FALSE),
    (1,  8, NULL,               NULL,                     FALSE, FALSE),
    (1,  9, 'Miguel Ángel R.', '7719876543',              FALSE, FALSE),
    (1, 10, 'Sara Mendoza',    'sara.m@uaeh.edu.mx',     TRUE,  FALSE);

-- ── Presupuestos para marzo 2026 ────────────────────────────
INSERT INTO presupuestos (categoria_id, mes, anio, monto_limite, usuario_id) VALUES
    (1,  3, 2026,  8000.00, 1),  -- Cuotas
    (6,  3, 2026,  1000.00, 1),  -- Papelería
    (7,  3, 2026,  1500.00, 1),  -- Transporte
    (8,  3, 2026,   800.00, 1),  -- Alimentación
    (10, 3, 2026,  2000.00, 1);  -- Servicios
