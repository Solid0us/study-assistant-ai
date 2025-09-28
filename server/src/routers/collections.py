from fastapi import APIRouter, Depends, HTTPException, status
from services.ai_service import ai_service
from services.jwt_service import get_jwt_payload, is_jwt_valid
from pydantic import BaseModel, Field
from dependencies import get_access_token
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import db, Collection, Flashcard
from datetime import datetime, timezone
from models.collection import CollectionSchema
from models.flashcard import FlashcardSchema

collections_router = APIRouter(
   prefix="/collections", 
   tags=["collections"],
   responses={404: {"description": "Not found"}}
   )

class FlashcardInBody(BaseModel):
   question: str
   answer: str

class CreateCollectionBody(BaseModel):
   name: str = Field(min_length=1)
   description: str | None = None

class AddFlashcardsToCollectionBody(BaseModel):
   flashcards: list[FlashcardInBody]

class GetFlashcardsInCollectionResponse(BaseModel):
   collection: CollectionSchema
   flashcards: list[FlashcardSchema]

@collections_router.post("/")
async def create_collection(body: CreateCollectionBody, token: str = Depends(get_access_token)):
   payload = get_jwt_payload(token, False)
   with Session(db.engine) as session:
      new_collection = Collection(name=body.name, description=body.description, user_id=payload["user_id"])
      session.add(new_collection)
      session.commit()
   return {"message": "Created Collection"}

@collections_router.get("/")
async def get_collections(token: str = Depends(get_access_token)):
   payload = get_jwt_payload(token, False)
   with Session(db.engine) as session:
      statement = select(Collection).where(Collection.user_id == payload["user_id"])
      collections = session.scalars(statement).all()
      return {"collections": collections}
   
@collections_router.get("/{collection_id}")
async def get_collection_by_id(collection_id: str,  token: str = Depends(get_access_token)):
   payload = get_jwt_payload(token, False)
   with Session(db.engine) as session:
      statement = select(Collection).where(
            Collection.id == collection_id,
            Collection.user_id == payload["user_id"]
      )
      collection = session.scalars(statement).first()
      if collection:
         return {"collection": collection}
      else:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find collection in database owned by the user."
         )

@collections_router.get("/{collection_id}/flashcards")
async def get_flashcards_in_collection(collection_id: str, token: str = Depends(get_access_token)) -> GetFlashcardsInCollectionResponse:
   payload = get_jwt_payload(token, False)
   with Session(db.engine) as session:
      statement = select(Collection).where(
         Collection.id == collection_id, 
         Collection.user_id == payload["user_id"]
      )
      collection = session.scalars(statement).first()
      if collection:
         statement = select(Flashcard).where(Flashcard.collection_id == collection_id)
         flashcards = session.scalars(statement).all()
         return {"collection": collection, "flashcards": flashcards}
      else:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find collection in database owned by the user."
         )

@collections_router.post("/{collection_id}/flashcards")
async def add_flashcards_to_collection(collection_id: str, body: AddFlashcardsToCollectionBody,  token: str = Depends(get_access_token)):
   payload = get_jwt_payload(token, False)
   with Session(db.engine) as session:
      statement = select(Collection).where(
         Collection.id == collection_id, 
         Collection.user_id == payload["user_id"]
      )
      collection = session.scalars(statement).first()
      if collection:
         now = datetime.now(timezone.utc)
         for flashcard in body.flashcards:
            new_flashcard = Flashcard(
               question=flashcard.question, 
               answer=flashcard.answer, 
               collection_id=collection_id,
               created_at=now
               )
            session.add(new_flashcard)
         session.commit()
      else:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find collection in database."
         )

   return {"collection": collection, "flashcards": body.flashcards}