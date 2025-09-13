from fastapi import FastAPI
from models import init_db
from routers import auth, flashcards

app = FastAPI()
init_db()

app.include_router(auth.auth_router)
app.include_router(flashcards.flashcard_router)

@app.get("/")
async def root():
   message = "Welcome to the AI study assistant app!"
   return {"message": message}