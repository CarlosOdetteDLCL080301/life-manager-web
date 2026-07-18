from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum

class CompraCreate(BaseModel):
    concepto: str = Field(..., max_length=255)
    tipo: str = Field(..., pattern="^(TDC|MSI|Debito|Efectivo)$")
    fecha: date
    monto: float = Field(..., gt=0)
    comprador_id: int = 1 # Por defecto asignará tu ID (1)
    meses_restantes: Optional[int] = None