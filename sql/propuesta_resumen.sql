-- Encontrar cuanto dinero se debe en la American Express
SELECT SUM(monto) AS DEUDA_TC FROM z_historial_compras WHERE (fecha BETWEEN '2026-07-05' AND '2026-08-06') AND (tipo IN ('TDC','MSI'));

-- Encontrar cuanto dinero se debe a MSI
SELECT SUM(monto) AS DEUDA_TC FROM z_historial_compras WHERE (fecha BETWEEN '2026-07-05' AND '2026-08-06') AND (tipo IN ('MSI'));

-- Encontrar cuanto dinero se debe a TDC
SELECT SUM(monto) AS DEUDA_TC FROM z_historial_compras WHERE (fecha BETWEEN '2026-07-05' AND '2026-08-06') AND (tipo IN ('TDC'));

-- Mostrar las compras agregadas recientemente
SELECT * FROM z_historial_compras ORDER BY z_historial_compras.creado_at DESC LIMIT 4;