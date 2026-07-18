from fastapi import APIRouter, HTTPException
from model.compras_schemas import CompraCreate
from services.compras_service import ComprasService
from services.historialCompras_service import HistorialComprasService

router = APIRouter(
    prefix="/compras",
    tags=["Gestión de Compras"]
)

@router.post("/")
def crear_compra(compra: CompraCreate):
    try:
        resultado = ComprasService.guardar_compra(compra)
        return resultado
    except ValueError as ve:
        # Error 400 si falló la regla de los meses
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Error 500 si falló la base de datos
        print(f"Error interno: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor al guardar la compra")
    
@router.get("/historial")

def obtener_historial_compras():
    try:
        historial = HistorialComprasService.obtener_historial_compras()
        return historial
    except Exception as e:
        print(f"Error interno: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor al obtener el historial de compras")
