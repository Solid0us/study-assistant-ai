from pydantic import BaseModel
from .db import Base
from typing import TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

if TYPE_CHECKING:
   from . import Flashcard, User

class FlashcardScore(Base):
   __tablename__ = "flashcard_scores"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   flashcard_id: Mapped[UUID] = mapped_column(ForeignKey("flashcards.id"))
   user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
   confidence_level: Mapped[int] = mapped_column()
   reviewed_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

   flashcard: Mapped["Flashcard"] = relationship(back_populates="flashcard_scores")
   user: Mapped["User"] = relationship(back_populates="flashcard_scores")
   
   __table_args__ = (
      CheckConstraint("confidence_level BETWEEN 1 AND 5", name="check_confidence_level_range"),
   )

   def __init__(self, **kwargs):
      kwargs.setdefault("id", uuid.uuid4())
      super().__init__(**kwargs)

class FlashcardScoreSchema(BaseModel):
   id: uuid.UUID
   flashcard_id: uuid.UUID
   user_id: uuid.UUID
   confidence_level: int
   reviewed_at: datetime
   
   class Config:
      orm_mode = True