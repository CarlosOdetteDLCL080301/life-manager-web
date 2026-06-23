from fastapi import APIRouter
from typing import List
from model.schemas import ModuloResponse
from services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Módulos del Dashboard"]
)

@router.get("/apps", response_model=List[ModuloResponse])
def get_apps_dinamicas():
    return DashboardService.listar_menu()