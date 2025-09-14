from fastapi import APIRouter, Depends, HTTPException, status
from services.ai_service import ai_service
from services.jwt_service import get_jwt_payload, is_jwt_valid
from pydantic import BaseModel, Field
from dependencies import get_access_token
from sqlalchemy.orm import Session
from models import db, Flashcard, Collection

flashcard_router = APIRouter(
   prefix="/flashcards", 
   tags=["flashcards"],
   responses={404: {"description": "Not found"}}
   )

class UpdateFlashCardBody(BaseModel):
   question: str = Field(min_length=1)
   answer: str = Field(min_length=1)
   collection_id: str


class FlashCardQuery(BaseModel):
   number: int = Field(gt=0, le=25)
   subject: str = Field(min_length=1, max_length=50)
   description: str = Field(default="", max_length=255)


@flashcard_router.put("/{flashcard_id}")
async def update_flashcard(
    flashcard_id: str,
    body: UpdateFlashCardBody,
    token: str = Depends(get_access_token)
):
    payload = get_jwt_payload(token, False)

    with Session(db.engine) as session:
        flashcard = (
            session.query(Flashcard)
            .join(Collection)
            .filter(
                Flashcard.id == flashcard_id,
                Collection.user_id == payload["user_id"]
            )
            .first()
        )

        if not flashcard:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flashcard not found or not owned by user."
            )

        flashcard.question = body.question
        flashcard.answer = body.answer
        flashcard.collection_id = body.collection_id

        session.commit()

    return {"message": "Flashcard updated successfully"}

@flashcard_router.post("/generate")
async def generate_flashcards(query: FlashCardQuery):
   flashcards = await ai_service.create_flashcards(query.number, query.subject, query.description)
   return {"flashcards": flashcards}