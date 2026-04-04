-- ============================================================
-- V7: Tabla de boletos de rifa
-- ============================================================

CREATE TABLE boletos_rifa (
    id                  BIGSERIAL    PRIMARY KEY,
    rifa_id             BIGINT       NOT NULL REFERENCES rifas (id) ON DELETE CASCADE,
    numero              INT          NOT NULL CHECK (numero > 0),
    comprador_nombre    VARCHAR(200),
    comprador_contacto  VARCHAR(255),
    pagado              BOOLEAN      NOT NULL DEFAULT FALSE,
    ganador             BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_boleto_numero_rifa UNIQUE (rifa_id, numero)
);

CREATE INDEX idx_boletos_rifa     ON boletos_rifa (rifa_id);
CREATE INDEX idx_boletos_pagado   ON boletos_rifa (pagado);
CREATE INDEX idx_boletos_ganador  ON boletos_rifa (ganador);
