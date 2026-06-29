CREATE TABLE z_historial_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(255) NOT NULL,
    tipo ENUM('Gasto extra', 'Gasto Fijo', 'A meses') NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    comprador_id INT NOT NULL DEFAULT 1 COMMENT 'ID 1 por defecto para Odette',
    meses_restantes INT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);