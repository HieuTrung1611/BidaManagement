from fastapi import APIRouter, UploadFile, File
from app.services.face_service import create_face_embedding

router = APIRouter(
    prefix="/face",
    tags=["Face AI"]
)


@router.post("/embedding")
async def embedding(file: UploadFile = File(...)):
    return await create_face_embedding(file)