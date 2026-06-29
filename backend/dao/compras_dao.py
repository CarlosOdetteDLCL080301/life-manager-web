from core.database import Database

class ComprasDAO:
    @staticmethod
    def registrar_compra(datos: dict):
        conexion = Database.get_connection()
        cursor = conexion.cursor()
        
        try:
            consulta = """
                INSERT INTO z_historial_compras 
                (concepto, tipo, fecha, monto, comprador_id, meses_restantes) 
                VALUES (%(concepto)s, %(tipo)s, %(fecha)s, %(monto)s, %(comprador_id)s, %(meses_restantes)s);
            """
            cursor.execute(consulta, datos)
            # Retornamos el ID autoincrementable que MySQL acaba de generar
            return cursor.lastrowid
            
        finally:
            cursor.close()
            conexion.close()