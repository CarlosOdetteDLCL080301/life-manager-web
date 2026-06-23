from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from a2wsgi import ASGIMiddleware
from api.dashboard_router import router as dashboard_router

app = FastAPI(title="Mi API Modular")

# Aquí es donde configuras el CORS (La lista de invitados)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que cualquier frontend consuma la API por ahora
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# Un endpoint de prueba para saber que funciona
@app.get("/test")
def ruta_de_prueba():
    return {"mensaje": "El backend de Odette está vivo"}

# Conectas la ruta al servidor
app.include_router(dashboard_router)

# ESTO ES CLAVE: El adaptador para que tu panel de hosting lo entienda
application = ASGIMiddleware(app)