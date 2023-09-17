from pydantic import BaseModel, EmailStr
from typing import Optional

class Patient(BaseModel) :
    message: str | None = None
    fall_detection: str | None = None
    urine_detection: str | None = None
    ecg: str | None = None
    user_id : int

class User(BaseModel) :
    name : str
    phone : str
    password : str

class UpdateUser(BaseModel) :
    name : str
    phone : str
    role : int | None = 1

class ResponsePatient(BaseModel):
    id: int
    message: str | None = None
    fall_detection: str | None = None
    urine_detection: str | None = None
    ecg: str | None = None
    user_id : int
    class Config:
        orm_mode = True
        
class ResponseUser(BaseModel) :
    id : int
    role : int
    name : str
    phone : str

    class Config :
        orm_mode = True
        
class UserLogin(BaseModel) :
    phone : EmailStr
    password : str

class Token(BaseModel) :
    access_token : str
    token_type : str

class TokenData(BaseModel) :
    id : int | None = None
    role : int | None = None
    