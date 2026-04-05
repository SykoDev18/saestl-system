-- ============================================================
-- V100: Campos adicionales para eventos de la UI
-- ============================================================

ALTER TABLE eventos
    ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) NOT NULL DEFAULT 'academico',
    ADD COLUMN IF NOT EXISTS hora_fin VARCHAR(5),
    ADD COLUMN IF NOT EXISTS direccion VARCHAR(300),
    ADD COLUMN IF NOT EXISTS maps_link VARCHAR(500),
    ADD COLUMN IF NOT EXISTS registrados INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS capacidad INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS presupuesto NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS estado VARCHAR(30) NOT NULL DEFAULT 'proximo',
    ADD COLUMN IF NOT EXISTS costo NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS costo_por VARCHAR(20),
    ADD COLUMN IF NOT EXISTS fecha_limite_registro DATE,
    ADD COLUMN IF NOT EXISTS organizador VARCHAR(200),
    ADD COLUMN IF NOT EXISTS requisitos TEXT,
    ADD COLUMN IF NOT EXISTS notas TEXT;