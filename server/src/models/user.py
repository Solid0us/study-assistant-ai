from .db import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
   from . import RefreshToken, Collection

class User(Base):
   __tablename__ = "users"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   username: Mapped[str] = mapped_column(
      String(30),
      unique=True
   )
   email: Mapped[str] = mapped_column(unique=True)
   password: Mapped[str] = mapped_column()

   refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")
   collections: Mapped[list["Collection"]] = relationship(back_populates="user")
   
   def __init__(self, **kwargs):
      kwargs.setdefault("id", uuid.uuid4())
      super().__init__(**kwargs)