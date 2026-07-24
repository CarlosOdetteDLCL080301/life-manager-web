from fastapi import APIRouter, HTTPException, Query
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

# 1. Endpoint para Compras Recientes
@router.get("/recientes")
def obtener_recientes():
    try:
        return HistorialComprasService.obtener_compras_recientes()
    except Exception as e:
        print(f"Error interno: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener compras recientes")

# 2. Endpoints para Totales Dinámicos
@router.get("/tdc")
def obtener_total_tdc(inicio: str = Query(...), fin: str = Query(...)):
    try:
        total = HistorialComprasService.obtener_suma_dashboard('TDC', inicio, fin)
        return {"total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/msi")
def obtener_total_msi(inicio: str = Query(...), fin: str = Query(...)):
    try:
        total = HistorialComprasService.obtener_suma_dashboard('MSI', inicio, fin)
        return {"total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/debito")
def obtener_total_debito(inicio: str = Query(...), fin: str = Query(...)):
    try:
        total = HistorialComprasService.obtener_suma_dashboard('Debito', inicio, fin)
        return {"total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/efectivo")
def obtener_total_efectivo(inicio: str = Query(...), fin: str = Query(...)):
    try:
        total = HistorialComprasService.obtener_suma_dashboard('Efectivo', inicio, fin)
        return {"total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))