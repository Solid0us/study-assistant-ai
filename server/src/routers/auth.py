from fastapi import APIRouter, Response, status, Depends
from pydantic import BaseModel, Field, EmailStr
from models import User, db, RefreshToken
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from services.jwt_service import generate_jwt_token, get_jwt_payload
from dependencies import get_refresh_token
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
         refresh_token = generate_jwt_token(str(new_user.id), new_user.username, True)
         access_token = generate_jwt_token(str(new_user.id), new_user.username, False)
         session.add(
            RefreshToken(
               refresh_token=refresh_token["token"], 
               issued_at=refresh_token["payload"]["iat"], 
               expires_at=refresh_token["payload"]["exp"], 
               user_id=new_user.id)
            )
         session.commit()

      except Exception as e:
         return {"message": e}

   return {"accessToken": access_token, "refreshToken": refresh_token}

@auth_router.post("/login")
async def login(body: LoginBody, response: Response):
   user_statement = select(User).where(User.username.ilike(body.username))
   with Session(db.engine) as session:
      user = session.scalars(user_statement).first()
      if user:
         matched = bcrypt.checkpw(
            body.password.encode("utf-8"), 
            user.password.encode("utf-8")
         )
         if matched:
            refresh_token = generate_jwt_token(str(user.id), user.username, True)
            access_token = generate_jwt_token(str(user.id), user.username, False)
            session.add(
               RefreshToken(
                  refresh_token=refresh_token["token"], 
                  issued_at=refresh_token["payload"]["iat"], 
                  expires_at=refresh_token["payload"]["exp"], 
                  user_id=user.id)
               )
            session.commit()
            return {"accessToken": access_token, "refreshToken": refresh_token}
      response.status_code = status.HTTP_401_UNAUTHORIZED
      return {"message": f"Incorrect username or password."}
      
@auth_router.post("/signout")
async def signout(token: str = Depends(get_refresh_token)):
   with Session(db.engine) as session:
      statement = update(RefreshToken).where(RefreshToken.refresh_token == token).values(is_revoked=True)
      session.execute(statement)
      session.commit()
   return {"message": f"Successfully signed out."}

@auth_router.post("/refresh")
async def refresh_token(token: str = Depends(get_refresh_token)):
   payload = get_jwt_payload(token, True)
   return generate_jwt_token(user_id=payload["user_id"], username=payload["username"], isRefresh=False)