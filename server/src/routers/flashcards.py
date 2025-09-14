from fastapi import APIRouter, Depends
from services.ai_service import ai_service
from services.jwt_service import get_jwt_payload, is_jwt_valid
from pydantic import BaseModel, Field
from dependencies import get_access_token

flashcard_router = APIRouter(
   prefix="/flashcards", 
   tags=["flashcards"],
   responses={404: {"description": "Not found"}}
   )

class FlashCard(BaseModel):
   question: str
   answer: str

class CreateFlashCardBody(BaseModel):
   flashcards: list[FlashCard] = Field(min_length=1, max_length=25)

class FlashCardQuery(BaseModel):
   number: int = Field(gt=0, le=25)
   subject: str = Field(min_length=1, max_length=50)
   description: str = Field(default="", max_length=255)


@flashcard_router.post("/")
async def create_flashcards(body: CreateFlashCardBody, token: str = Depends(get_access_token)):
   payload = get_jwt_payload(token, False)
   if is_jwt_valid(token, False):
      print("Valid")
   else:
      print("Invalid")

@flashcard_router.post("/generate")
async def generate_flashcards(query: FlashCardQuery):
   flashcards = await ai_service.create_flashcards(query.number, query.subject, query.description)
   return {"flashcards": flashcards}