from fastapi import status, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import db, RefreshToken
from sqlalchemy.orm import Session
from sqlalchemy import select
from services.jwt_service import is_jwt_valid

bearer_scheme = HTTPBearer()
async def get_refresh_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
   with Session(db.engine) as session:
      statement = select(RefreshToken).where(RefreshToken.refresh_token == credentials.credentials)
      refresh_token = session.scalars(statement).first()
      if refresh_token and is_jwt_valid(refresh_token, True):
          return credentials.credentials
      raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
      )
  
async def get_access_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if is_jwt_valid(credentials.credentials, False):
        return credentials.credentials
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
  
