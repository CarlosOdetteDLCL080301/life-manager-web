from core.database import Database

class HistorialComprasDAO:
    @staticmethod
    def ObtenerHistorialCompras():
        conexion = Database.get_connection()
        cursor = conexion.cursor()

        try:
            consulta = """
                SELECT id, concepto, tipo, fecha, monto, comprador_id, meses_restantes, creado_at
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