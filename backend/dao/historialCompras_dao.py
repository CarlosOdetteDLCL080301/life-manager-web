from core.database import Database

class HistorialComprasDAO:
    @staticmethod
    def ObtenerHistorialCompras():
        conexion = Database.get_connection()
        cursor = conexion.cursor()

        try:
            consulta = """
                SELECT id, concepto, tipo, fecha, monto, comprador_id, meses_restantes, total_meses, creado_at
                FROM z_historial_compras
                ORDER BY fecha DESC, creado_at DESC;
            """
            cursor.execute(consulta)
            
            resultados = cursor.fetchall()
            
            return resultados

        finally:
            # Siempre cerramos el cursor y la conexión
            cursor.close()
            conexion.close()

    @staticmethod
    def obtener_total_por_tipo_y_fecha(tipo: str, fecha_inicio: str, fecha_fin: str) -> float:
        conexion = Database.get_connection()
        cursor = conexion.cursor()
        try:
            consulta = """
                SELECT SUM(monto) AS total 
                FROM z_historial_compras 
                WHERE (fecha BETWEEN %s AND %s) AND tipo = %s;
            """
            cursor.execute(consulta, (fecha_inicio, fecha_fin, tipo))
            resultado = cursor.fetchone()
            
            # Si no hay compras en esa fecha, MySQL devuelve NULL. Lo convertimos a 0.0
            if resultado and resultado['total'] is not None:
                return float(resultado['total'])
            return 0.0
        finally:
            cursor.close()
            conexion.close()

    @staticmethod
    def obtener_compras_recientes():
        conexion = Database.get_connection()
        cursor = conexion.cursor()
        try:
            # Traemos solo las últimas 4 compras para el dashboard
            consulta = """
                SELECT id, concepto, tipo, fecha, monto AS costo 
                FROM z_historial_compras 
                ORDER BY creado_at DESC 
                LIMIT 4;
            """
            cursor.execute(consulta)
            return cursor.fetchall()
        finally:
            cursor.close()
            conexion.close()