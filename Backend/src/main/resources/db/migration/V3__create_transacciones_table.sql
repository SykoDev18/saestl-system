-- ============================================================
-- V3: Tabla de transacciones (ingresos / egresos)
-- ============================================================

CREATE TABLE transacciones (
    id           BIGSERIAL      PRIMARY KEY,
    tipo         VARCHAR(10)    NOT NULL CHECK (tipo IN ('INGRESO', 'EGRESO')),
    monto        NUMERIC(12, 2) NOT NULL CHECK (monto > 0),
    descripcion  VARCHAR(500),
    fecha        DATE           NOT NULL DEFAULT CURRENT_DATE,
    categoria_id BIGINT         NOT NULL REFERENCES categorias (id) ON DELETE RESTRICT,
    usuario_id   BIGINT         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transacciones_fecha       ON transacciones (fecha);
CREATE INDEX idx_transacciones_tipo        ON transacciones (tipo);
CREATE INDEX idx_transacciones_categoria   ON transacciones (categoria_id);
CREATE INDEX idx_transacciones_usuario     ON transacciones (usuario_id);
CREATE INDEX idx_transacciones_fecha_tipo  ON transacciones (fecha, tipo);
