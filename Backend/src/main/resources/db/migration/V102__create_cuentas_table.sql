-- ============================================================
-- V102: Tabla de cuentas por pagar
-- ============================================================

CREATE TABLE IF NOT EXISTS cuentas (
    id           BIGSERIAL      PRIMARY KEY,
    descripcion  VARCHAR(300)   NOT NULL,
    monto        NUMERIC(12, 2) NOT NULL CHECK (monto > 0),
    fecha_limite DATE           NOT NULL,
    estado       VARCHAR(20)    NOT NULL DEFAULT 'PENDIENTE',
    proveedor    VARCHAR(200)   NOT NULL,
    categoria    VARCHAR(120)   NOT NULL,
    usuario_id   BIGINT         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cuentas_estado      ON cuentas (estado);
CREATE INDEX IF NOT EXISTS idx_cuentas_fecha_limite ON cuentas (fecha_limite);
CREATE INDEX IF NOT EXISTS idx_cuentas_usuario     ON cuentas (usuario_id);