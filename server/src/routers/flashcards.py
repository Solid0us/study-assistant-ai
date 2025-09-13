from fastapi import APIRouter
from services.ai_service import ai_service
from pydantic import BaseModel, Field

flashcard_router = APIRouter(
   prefix="/flashcards", 
   tags=["flashcards"],
   responses={404: {"description": "Not found"}}
   )

class FlashCardQuery(BaseModel):
   number: int = Field(gt=0, le=25)
   subject: str = Field(min_length=1, max_length=50)
   description: str = Field(default="", max_length=255)


@flashcard_router.post("/generate")
async def generate_flashcards(query: FlashCardQuery):
   flashcards = await ai_service.create_flashcards(query.number, query.subject, query.description)
   return {"flashcards": flashcards}