import os
import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv

# load_dotenv() buscará un archivo .env en tu computadora (para desarrollo local).
# En DirectAdmin, como no hay .env, simplemente lo ignora y usa las variables del panel web.
load_dotenv()

class Database:
    @staticmethod
    def get_connection():
        """Devuelve la conexión a MySQL usando las variables de entorno del sistema."""
        try:
            return pymysql.connect(
                host=os.getenv("DB_HOST", "localhost").strip(),
                port=3306,
                database=os.getenv("DB_NAME", "").strip(),
                user=os.getenv("DB_USER", "").strip(),
                password=os.getenv("DB_PASS", "").strip(),
                cursorclass=DictCursor,
                autocommit=True
            )
        except Exception as e:
            print(f"Error fatal de conexión a MySQL: {e}")
            raise e