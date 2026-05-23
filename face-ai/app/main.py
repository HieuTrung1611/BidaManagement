import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Config

from app.routes.face_routes import router as face_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(face_router)


@app.get("/")
def home():
    return {
        "message": "Face AI Running"
    }