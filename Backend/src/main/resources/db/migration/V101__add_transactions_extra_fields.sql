-- ============================================================
-- V101: Campos extra para transacciones (estado/metodo/responsable)
-- ============================================================

ALTER TABLE transacciones
    ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(20) NOT NULL DEFAULT 'EFECTIVO',
    ADD COLUMN IF NOT EXISTS responsable VARCHAR(120);

UPDATE transacciones
SET estado = COALESCE(estado, 'PENDIENTE'),
    metodo_pago = COALESCE(metodo_pago, 'EFECTIVO');