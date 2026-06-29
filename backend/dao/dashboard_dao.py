from core.database import Database

class DashboardDAO:
    @staticmethod
    def obtener_modulos_activos():
        conexion = Database.get_connection()
        cursor = conexion.cursor()
        
        try:
            consulta = """
                SELECT id, titulo, icono, url 
                FROM z_modulos_dashboard 
                WHERE activo = TRUE 
                ORDER BY id ASC;
            """
            cursor.execute(consulta)
            return cursor.fetchall()
            
        finally:
            # Siempre cerramos el cursor y la conexión, pase lo que pase
            cursor.close()
            conexion.close()