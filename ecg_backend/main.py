from fastapi import FastAPI
import models
from database import engine
from routers import user, auth
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://localhost",
    "https://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)
if __name__ == "__main__":
 uvicorn.run(app, host="0.0.0.0", port=80)
