ALTER TABLE presupuestos
    ADD COLUMN nombre VARCHAR(150);

UPDATE presupuestos p
SET nombre = c.nombre
FROM categorias c
WHERE c.id = p.categoria_id
  AND (p.nombre IS NULL OR TRIM(p.nombre) = '');

ALTER TABLE presupuestos
    ALTER COLUMN nombre SET NOT NULL;