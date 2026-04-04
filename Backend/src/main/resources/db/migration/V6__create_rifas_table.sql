-- ============================================================
-- V6: Tabla de rifas
-- ============================================================

CREATE TABLE rifas (
    id              BIGSERIAL      PRIMARY KEY,
    nombre          VARCHAR(200)   NOT NULL,
    descripcion     TEXT,
    precio_boleto   NUMERIC(12, 2) NOT NULL CHECK (precio_boleto > 0),
    fecha_sorteo    TIMESTAMP      NOT NULL,
    activo          BOOLEAN        NOT NULL DEFAULT TRUE,
    usuario_id      BIGINT         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rifas_fecha_sorteo ON rifas (fecha_sorteo);
CREATE INDEX idx_rifas_activo       ON rifas (activo);
CREATE INDEX idx_rifas_usuario      ON rifas (usuario_id);
