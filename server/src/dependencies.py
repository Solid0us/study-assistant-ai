from fastapi import status, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import db, RefreshToken
from sqlalchemy.orm import Session
from sqlalchemy import select

bearer_scheme = HTTPBearer()
async def get_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
   with Session(db.engine) as session:
      statement = select(RefreshToken).where(RefreshToken.refresh_token == credentials.credentials)
      refresh_token = session.scalars(statement).first()
      if refresh_token:
          return credentials.credentials
      raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
      )
  
