from fastapi import FastAPI
from pydantic import BaseModel, Field
from services.ai_service import ai_service

app = FastAPI()

class BasicQuery(BaseModel):
   prompt: str

class FlashCardQuery(BaseModel):
   number: int = Field(gt=0, le=25)
   subject: str = Field(min_length=1, max_length=50)
   description: str = Field(default="", max_length=255)

@app.get("/")
async def root():
   message = "Hello from the server!"
   return {"message": message}

@app.post("/chat")
async def generate(prompt: BasicQuery):
   response = await ai_service.chat(prompt.prompt)
   return {"prompt": prompt.prompt, "response": response}

@app.post("/flashcards/generate")
async def generate_flashcards(query: FlashCardQuery):
   flashcards = await ai_service.create_flashcards(query.number, query.subject, query.description)
   return {"flashcards": flashcards}