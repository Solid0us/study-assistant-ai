from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import init_db
from routers import auth, flashcards, collections
from dotenv import load_dotenv
import os

load_dotenv()
CORS_ORIGIN=os.environ.get("CORS_ORIGIN")
origins = CORS_ORIGIN.split(",")

app = FastAPI()
app.add_middleware(
   CORSMiddleware,
   allow_origins=origins,
   allow_credentials=True,
   allow_methods="*",
   allow_headers="*"
   
)
init_db()

app.include_router(auth.auth_router)
app.include_router(flashcards.flashcard_router)
app.include_router(collections.collections_router)

@app.get("/")
async def root():
   message = "Welcome to the AI study assistant app!"
   return {"message": message}