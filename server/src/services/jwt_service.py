import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
load_dotenv()

ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")
REFRESH_TOKEN_SECRET = os.environ.get("REFRESH_TOKEN_SECRET")
ALGORITHM = "HS256"

class Payload:
   user_id: str
   username: str
   iat: datetime
   exp: datetime

def generate_jwt_token(user_id: str, username: str, isRefresh: bool):
   issued_date = datetime.now(timezone.utc)
   if isRefresh:
      exp_date = issued_date + timedelta(days=30)
   else:
      exp_date = issued_date + timedelta(seconds=5)
   payload: Payload = {
      "user_id": user_id,
      "username": username,
      "iat": issued_date,
      "exp": exp_date
   }
   if isRefresh:
      encoded_jwt = jwt.encode(payload, REFRESH_TOKEN_SECRET, algorithm=ALGORITHM)
   else:
      encoded_jwt = jwt.encode(payload, ACCESS_TOKEN_SECRET, algorithm=ALGORITHM)
   return {"token": encoded_jwt, "payload": payload}

def is_jwt_valid(encoded_jwt: str, isRefresh: bool):
   try:
      if (isRefresh):
         decoded_payload = jwt.decode(encoded_jwt, REFRESH_TOKEN_SECRET, algorithms=[ALGORITHM])
      else:
         decoded_payload = jwt.decode(encoded_jwt, ACCESS_TOKEN_SECRET, algorithms=[ALGORITHM])
      print(decoded_payload)
      return True
   except jwt.ExpiredSignatureError:
      print("Token has expired")
   except jwt.InvalidTokenError:
      print("Invalid token")
   return False

def get_jwt_payload(token: str, isRefresh: bool) -> Payload:
   if isRefresh:
      return jwt.decode(token, REFRESH_TOKEN_SECRET, ALGORITHM)
   return jwt.decode(token, ACCESS_TOKEN_SECRET, ALGORITHM)