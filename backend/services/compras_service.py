from dao.compras_dao import ComprasDAO
from model.compras_schemas import CompraCreate

class ComprasService:
    @staticmethod
    def guardar_compra(compra: CompraCreate):
        # 1. Validación de reglas de negocio
        if compra.tipo == "A meses" and (compra.meses_restantes is None or compra.meses_restantes <= 0):
            raise ValueError("Un gasto 'A meses' requiere especificar cuántos meses restan de forma válida.")
        
        # 2. Convertir el esquema a diccionario para el DAO
        datos_diccionario = compra.model_dump()
        
        # 3. Guardar en Base de Datos
        nuevo_id = ComprasDAO.registrar_compra(datos_diccionario)
        
        return {
            "mensaje": "Compra registrada exitosamente", 
            "id_compra": nuevo_id
        }