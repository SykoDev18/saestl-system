-- ============================================================
-- V4: Tabla de eventos
-- ============================================================

CREATE TABLE eventos (
    id          BIGSERIAL     PRIMARY KEY,
    nombre      VARCHAR(200)  NOT NULL,
    descripcion TEXT,
    fecha       TIMESTAMP     NOT NULL,
    lugar       VARCHAR(300),
    activo      BOOLEAN       NOT NULL DEFAULT TRUE,
    usuario_id  BIGINT        NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eventos_fecha   ON eventos (fecha);
CREATE INDEX idx_eventos_activo  ON eventos (activo);
CREATE INDEX idx_eventos_usuario ON eventos (usuario_id);
