from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from src.services.ai_service import ai_service
from src.services.jwt_service import get_jwt_payload, is_jwt_valid
from pydantic import BaseModel, Field
from src.dependencies import get_access_token
from sqlalchemy.orm import Session
from src.models import db, Flashcard, Collection, FlashcardScore
from datetime import datetime, timezone

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

class AddFlashcardScoreBody(BaseModel):
    confidence_level: int = Field(gt=0, lt=6)


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

@flashcard_router.get("/{flashcard_id}/scores")
async def get_flashcard_scores(flashcard_id: str, token: str = Depends(get_access_token)):
    payload = get_jwt_payload(token, False)

    with Session(db.engine) as session:
        statement = (
            session.query(FlashcardScore)
            .where(
                FlashcardScore.user_id == payload["user_id"], 
                FlashcardScore.flashcard_id == flashcard_id
                )
        )
        scores = session.scalars(statement).all()
        return {"scores": scores}
    

@flashcard_router.post("/{flashcard_id}/scores")
async def create_flashcard_scores(flashcard_id: str, body: AddFlashcardScoreBody, token: str = Depends(get_access_token)):
    payload = get_jwt_payload(token, False)

    with Session(db.engine) as session:
        statement = select(Flashcard).join(Collection).where(
            Collection.user_id == payload["user_id"],
            Flashcard.id == flashcard_id
        )
        flashcard = session.execute(statement).first()
        if flashcard:
            new_score = FlashcardScore(
                user_id=payload["user_id"],
                flashcard_id=flashcard_id,
                confidence_level=body.confidence_level,
                reviewed_at=datetime.now(timezone.utc)
            )
            session.add(new_score)
            session.commit()
            return {"message": "Score has been submitted!"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not find flashcard belonging to the user."
            )
