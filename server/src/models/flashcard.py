from pydantic import BaseModel
from .db import Base
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import TYPE_CHECKING
from datetime import datetime, timezone

if TYPE_CHECKING:
   from . import Collection

class Flashcard(Base):
   __tablename__ = "flashcards"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   question: Mapped[str] = mapped_column()
   answer: Mapped[str] = mapped_column()
   collection_id: Mapped[UUID] = mapped_column(ForeignKey("collections.id"))
   created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

   collection: Mapped["Collection"] = relationship(back_populates="flashcards")

   def __init__(self, **kwargs):
      kwargs.setdefault("id", uuid.uuid4())
      super().__init__(**kwargs)

class FlashcardSchema(BaseModel):
   id: uuid.UUID
   question: str
   answer: str
   collection_id: uuid.UUID
   created_at: datetime

   class Config:
      orm_mode = True