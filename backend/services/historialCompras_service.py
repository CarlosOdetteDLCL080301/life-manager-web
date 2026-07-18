from dao.historialCompras_dao import HistorialComprasDAO

class HistorialComprasService:
    @staticmethod
    def obtener_historial_compras():        
        return HistorialComprasDAO.ObtenerHistorialCompras()