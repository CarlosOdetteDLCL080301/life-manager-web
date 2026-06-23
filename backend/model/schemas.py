from pydantic import BaseModel

class ModuloResponse(BaseModel):
    id: int
    titulo: str
    icono: str
    url: str