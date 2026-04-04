-- ============================================================
-- V8: Tabla de presupuestos por categoría y mes
-- ============================================================

CREATE TABLE presupuestos (
    id           BIGSERIAL      PRIMARY KEY,
    categoria_id BIGINT         NOT NULL REFERENCES categorias (id) ON DELETE RESTRICT,
    mes          INT            NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio         INT            NOT NULL CHECK (anio BETWEEN 2020 AND 2100),
    monto_limite NUMERIC(12, 2) NOT NULL CHECK (monto_limite > 0),
    usuario_id   BIGINT         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW(),

    -- Un solo presupuesto por categoría-mes-año-usuario
    CONSTRAINT uq_presupuesto_cat_periodo UNIQUE (categoria_id, mes, anio, usuario_id)
);

CREATE INDEX idx_presupuestos_categoria ON presupuestos (categoria_id);
CREATE INDEX idx_presupuestos_periodo   ON presupuestos (anio, mes);
CREATE INDEX idx_presupuestos_usuario   ON presupuestos (usuario_id);
