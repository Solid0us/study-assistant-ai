from .db import Base
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from typing import TYPE_CHECKING
from datetime import datetime, timezone
from pydantic import BaseModel

if TYPE_CHECKING:
   from . import User, Flashcard

class Collection(Base):
   __tablename__ = "collections"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   name: Mapped[str] = mapped_column()
   description: Mapped[str] = mapped_column(nullable=True)
   user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
   created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

   user: Mapped["User"] = relationship(back_populates="collections")
   flashcards: Mapped[list["Flashcard"]] = relationship(back_populates="collection")

   def __init__(self, **kwargs):
      kwargs.setdefault("id", uuid.uuid4())
      super().__init__(**kwargs)

class CollectionSchema(BaseModel):
   id: uuid.UUID
   name:  str
   description: str | None
   user_id: uuid.UUID
   created_at: datetime

   class Config:
      orm_mode = True