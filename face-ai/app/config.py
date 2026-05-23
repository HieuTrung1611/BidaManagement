from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 8080))
    HOST = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")