from dao.dashboard_dao import DashboardDAO

class DashboardService:
    @staticmethod
    def listar_menu():
        return DashboardDAO.obtener_modulos_activos()