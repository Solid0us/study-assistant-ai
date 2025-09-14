from .db import Base
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
   from . import User

class RefreshToken(Base):
   __tablename__ = "refresh_tokens"
   id: Mapped[uuid.UUID] = mapped_column(
   UUID(as_uuid=True), 
   primary_key=True, 
   default=uuid.uuid4
   )
   refresh_token: Mapped[str] = mapped_column()
   issued_at: Mapped[datetime] = mapped_column(default=datetime.now().isoformat())
   expires_at: Mapped[datetime] = mapped_column()
   is_revoked: Mapped[bool] = mapped_column(default=False)
   user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))

   user: Mapped["User"] = relationship(back_populates="refresh_tokens")
   
   def __init__(self, **kwargs):
      kwargs.setdefault("id", uuid.uuid4())
      super().__init__(**kwargs)