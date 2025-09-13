from .db import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(Base):
   __tablename__ = "users"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   username: Mapped[str] = mapped_column(
      String(30)
   )
   email: Mapped[str] = mapped_column()
   password: Mapped[str] = mapped_column()