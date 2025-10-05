from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
load_dotenv()

TESTING = os.environ.get("TESTING", "false").lower() == "true"

if TESTING:
   engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
else:
   DB_USERNAME = os.environ.get("DB_USERNAME")
   DB_PASSWORD = os.environ.get("DB_PASSWORD")
   DB_HOST = os.environ.get("DB_HOST")
   DB_PORT = os.environ.get("DB_PORT")
   DB_NAME = os.environ.get("DB_NAME")

   engine = create_engine(f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
class Base(DeclarativeBase):
   pass
