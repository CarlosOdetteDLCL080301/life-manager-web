import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Esto busca el archivo .env y carga sus variables a la memoria
load_dotenv()

class Database:
    @staticmethod
    def get_connection():
        """Devuelve una conexión limpia y segura a PostgreSQL."""
        try:
            return psycopg2.connect(
                # Usamos os.getenv para pedirle el dato a la memoria del servidor
                host=os.getenv("DB_HOST"),
                database=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                cursor_factory=RealDictCursor
            )
        except Exception as e:
            print(f"Error fatal de conexión a BD: {e}")
            raise e