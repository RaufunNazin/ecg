from fastapi import FastAPI, Response, HTTPException, Depends, APIRouter, Query
from fastapi.params import Body
import models
from database import get_db
from sqlalchemy.orm import Session
from schemas import User, ResponseUser, ResponsePatient, Patient, UpdateUser
from passlib.context import CryptContext
from typing import List
from sqlalchemy import desc  # Import the 'desc' function to sort in descending order

router = APIRouter()

@router.post("/users", status_code = 201, response_model = ResponseUser, tags=['users'])
def create_user(user : User ,db : Session = Depends(get_db)) :
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_pass = pwd_context.hash(user.password)
    user.password = hashed_pass
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/users", response_model=List[ResponseUser], tags=['users'])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/users/{id}", response_model = ResponseUser, tags=['users'])
def get_user(id : int, db : Session = Depends(get_db)) :
    user = db.query(models.User).filter(models.User.id == id).first()
    return user

@router.put("/users/{id}", response_model=ResponseUser, tags=['users'])
def update_user(id: int, updated_user: UpdateUser, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.id == id).first()
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    for attr, value in updated_user.dict(exclude_unset=True).items():
        setattr(existing_user, attr, value)
    db.commit()
    db.refresh(existing_user)
    return existing_user


@router.delete("/users/{id}", response_model = ResponseUser, tags=['users'])
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user

@router.get("/patients", response_model=List[Patient], tags=['patients'])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.Patient).all()
    return users


@router.get("/patients/{id}", response_model=ResponsePatient, tags=['patients'])
def get_patient(id: int, db: Session = Depends(get_db)):
    # Order the results by a column (e.g., timestamp) in descending order and then get the first result.
    patient = db.query(models.Patient).filter(models.Patient.user_id == id).order_by(desc(models.Patient.created_at)).first()
    return patient


@router.post("/patients", status_code = 201, response_model = ResponsePatient, tags=['patients'])
def create_patient(patient : Patient, db : Session = Depends(get_db)) :
    new_patient = models.Patient(**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.put("/patients/{id}", response_model=ResponsePatient, tags=['patients'])
def update_patient(id: int, patient: Patient, db: Session = Depends(get_db)):
    existing_patient = db.query(models.Patient).filter(models.Patient.id == id).first()
    if existing_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    else :
        existing_user= db.query(models.User).filter(models.User.id == patient.user_id).first()
        print(existing_user)
        if existing_user is None :
            raise HTTPException(status_code=404, detail="User not found")
        for attr, value in patient.dict().items():
            setattr(existing_patient, attr, value)
        db.commit()
        db.refresh(existing_patient)
        return existing_patient
    
    
    
@router.post("/device/patients", status_code = 201, response_model = ResponsePatient, tags=['device'])
def create_patient(
    message: str = Query(default = None),
    fall_detection: str = Query(default = None),
    urine_detection: str  = Query(default = None),
    ecg: str = Query(default = None),
    user_id : int = Query(...),
    db: Session = Depends(get_db)
    ):
    
    new_patient = models.Patient(
        message=message,
        fall_detection=fall_detection,
        urine_detection=urine_detection,
        ecg=ecg,
        user_id = user_id
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient