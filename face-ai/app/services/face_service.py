from deepface import DeepFace
from fastapi import UploadFile, HTTPException
import tempfile
import os


async def create_face_embedding(file: UploadFile):

    temp = tempfile.NamedTemporaryFile(delete=False)

    try:
        content = await file.read()

        with open(temp.name, "wb") as f:
            f.write(content)

        embedding_objs = DeepFace.represent(
            img_path=temp.name,
            model_name="VGG-Face",
            enforce_detection=True
        )

        if not embedding_objs:
            raise HTTPException(
                status_code=400,
                detail="Không phát hiện khuôn mặt"
            )

        embedding = embedding_objs[0]["embedding"]

        return {
            "success": True,
            "embedding": embedding
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        os.unlink(temp.name)