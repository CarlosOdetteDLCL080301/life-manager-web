import os
import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv

# Esto busca el archivo .env y carga sus variables a la memoria
load_dotenv()

class Database:
    @staticmethod
    def get_connection():
        """Devuelve una conexión limpia y segura a MySQL."""
        try:
            return pymysql.connect(
                host=os.getenv("DB_HOST"),
                database=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                # Importante: MySQL usa cursorclass en lugar de cursor_factory
                cursorclass=DictCursor,
                autocommit=True 
            )
        except Exception as e:
            print(f"Error fatal de conexión a BD: {e}")
            raise e