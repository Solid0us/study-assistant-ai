from fastapi import APIRouter, Response, status
from pydantic import BaseModel, Field, EmailStr
from models import User, db
from sqlalchemy.orm import Session
from sqlalchemy import select
import bcrypt

salt = bcrypt.gensalt()

auth_router = APIRouter(
   prefix="/auth",
   tags=["auth"],
   responses={404: {"description": "Not found"}}
)

class RegisterBody(BaseModel):
   username: str = Field(min_length=5, max_length=50)
   email: EmailStr
   password: str = Field(min_length=8)

class LoginBody(BaseModel):
   username: str
   password: str

@auth_router.post("/register")
async def register(body: RegisterBody):
   hashed_password = bcrypt.hashpw(body.password.encode("utf-8"), salt)
   with Session(db.engine) as session:
      new_user = User(
            username=body.username,
            email=body.email,
            password=hashed_password.decode("utf-8")
      )
      try:
         session.add(new_user)
         session.commit()
      except Exception as e:
         return {"message": e}

   return {"message": "Registered User"}

@auth_router.post("/login")
async def login(body: LoginBody, response: Response):
   user_statement = select(User).where(User.username == body.username)
   with Session(db.engine) as session:
      user = session.scalars(user_statement).first()
      if user:
         matched = bcrypt.checkpw(
            body.password.encode("utf-8"), 
            user.password.encode("utf-8")
         )
         if matched:
            return {"message": "Logged in!"}
         response.status_code = status.HTTP_401_UNAUTHORIZED
         return {"message": f"Incorrect username or password."}
      else:
         response.status_code = status.HTTP_400_BAD_REQUEST
         return {"message": "Could not find user"}
