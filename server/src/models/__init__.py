from .db import Base, engine
from .user import User
from .refresh_tokens import RefreshToken
from .collection import Collection
from .flashcard import Flashcard
from .flashcard_scores import FlashcardScore

def init_db():
    Base.metadata.create_all(engine)