from .db import Base, engine
from .user import User

def init_db():
    Base.metadata.create_all(engine)