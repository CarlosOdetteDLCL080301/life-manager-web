from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class CompraCreate(BaseModel):
    concepto: str = Field(..., max_length=255)
    tipo: str = Field(..., pattern="^(Gasto extra|Gasto Fijo|A meses)$")
    fecha: date
    monto: float = Field(..., gt=0)
    comprador_id: int = 1 # Por defecto asignará tu ID (1)
    meses_restantes: Optional[int] = None