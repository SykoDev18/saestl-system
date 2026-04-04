-- ============================================================
-- V5: Tabla de asistentes a eventos
-- ============================================================

CREATE TABLE asistentes_evento (
    id         BIGSERIAL      PRIMARY KEY,
    evento_id  BIGINT         NOT NULL REFERENCES eventos (id) ON DELETE CASCADE,
    nombre     VARCHAR(200)   NOT NULL,
    email      VARCHAR(255),
    pago       BOOLEAN        NOT NULL DEFAULT FALSE,
    monto      NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (monto >= 0),
    created_at TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_asistentes_evento  ON asistentes_evento (evento_id);
CREATE INDEX idx_asistentes_pago    ON asistentes_evento (pago);

-- Evitar duplicado de email en el mismo evento
CREATE UNIQUE INDEX uq_asistente_evento_email
    ON asistentes_evento (evento_id, email)
    WHERE email IS NOT NULL;
