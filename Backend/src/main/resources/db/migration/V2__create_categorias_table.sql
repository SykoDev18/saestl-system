-- ============================================================
-- V2: Tabla de categorías para transacciones y presupuestos
-- ============================================================

CREATE TABLE categorias (
    id         BIGSERIAL    PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    tipo       VARCHAR(10)  NOT NULL CHECK (tipo IN ('INGRESO', 'EGRESO')),
    color_hex  VARCHAR(7)   NOT NULL DEFAULT '#6B7280'
        CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
    activo     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_categorias_nombre_tipo UNIQUE (nombre, tipo)
);

CREATE INDEX idx_categorias_tipo   ON categorias (tipo);
CREATE INDEX idx_categorias_activo ON categorias (activo);

-- Categorías iniciales
INSERT INTO categorias (nombre, tipo, color_hex) VALUES
    ('Cuotas',          'INGRESO', '#10B981'),
    ('Donaciones',      'INGRESO', '#3B82F6'),
    ('Venta de boletos','INGRESO', '#F59E0B'),
    ('Eventos',         'INGRESO', '#8B5CF6'),
    ('Otros ingresos',  'INGRESO', '#6366F1'),
    ('Papelería',       'EGRESO',  '#EF4444'),
    ('Transporte',      'EGRESO',  '#F97316'),
    ('Alimentación',    'EGRESO',  '#EC4899'),
    ('Material',        'EGRESO',  '#14B8A6'),
    ('Servicios',       'EGRESO',  '#64748B'),
    ('Otros egresos',   'EGRESO',  '#78716C');
