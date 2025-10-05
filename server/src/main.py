from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.models import init_db
from src.routers import auth, flashcards, collections
from dotenv import load_dotenv
import os

load_dotenv()
CORS_ORIGIN=os.environ.get("CORS_ORIGIN")
origins = CORS_ORIGIN.split(",")

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
   return JSONResponse(
      status_code=422,
      content=jsonable_encoder({"detail": exc.errors(), "body": exc.body})
   )

@app.exception_handler(IntegrityError)
async def db_integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Database integrity error", "message": str(exc.orig)},
    )

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