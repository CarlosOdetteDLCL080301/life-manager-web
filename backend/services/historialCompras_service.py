from dao.historialCompras_dao import HistorialComprasDAO

class HistorialComprasService:
    @staticmethod
    def obtener_historial_compras():        
        return HistorialComprasDAO.ObtenerHistorialCompras()

    @staticmethod
    def obtener_suma_dashboard(tipo: str, inicio: str, fin: str):
        return HistorialComprasDAO.obtener_total_por_tipo_y_fecha(tipo, inicio, fin)

    @staticmethod
    def obtener_compras_recientes():
        return HistorialComprasDAO.obtener_compras_recientes()