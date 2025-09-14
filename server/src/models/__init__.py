from .db import Base, engine
from .user import User
from .refresh_tokens import RefreshToken
from .collection import Collection
from .flashcard import Flashcard

def init_db():
    Base.metadata.create_all(engine)