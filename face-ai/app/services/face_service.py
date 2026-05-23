from deepface import DeepFace
from fastapi import UploadFile, HTTPException
import tempfile
import os
import traceback


async def create_face_embedding(file: UploadFile):

    temp = tempfile.NamedTemporaryFile(delete=False)

    try:
        content = await file.read()

        with open(temp.name, "wb") as f:
            f.write(content)

        embedding_objs = DeepFace.represent(
            img_path=temp.name,
            model_name="Facenet512",
            enforce_detection=True
        )

        embedding = embedding_objs[0]["embedding"]

        return {
            "success": True,
            "embedding": embedding
        }

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        os.unlink(temp.name)