from fastapi import Depends, status, APIRouter, HTTPException, Response, Body
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from database import get_db
from sqlalchemy.orm import Session
from schemas import Token
import models
from passlib.context import CryptContext
import utils
import oauth2


router = APIRouter( tags = ["Authentication"] )
@router.post("/login", response_model=Token)
def login_user(user_credentials: dict = Body(...), db: Session = Depends(get_db)):
    username = user_credentials.get("username")
    password = user_credentials.get("password")

    if username is None or password is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username and password are required")

    user = db.query(models.User).filter(models.User.phone == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not utils.verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    access_token = oauth2.create_access_token({"id": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "Bearer"}
