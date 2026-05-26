from deepface import DeepFace
from deepface.modules.exceptions import FaceNotDetected
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

        embedding_objs = None
        
        # Try with strict detection first
        try:
            print("🔵 Trying face detection with strict mode...")
            embedding_objs = DeepFace.represent(
                img_path=temp.name,
                model_name="Facenet512",
                enforce_detection=True
            )
            print("✅ Face detected with strict mode")
        except FaceNotDetected as e:
            # If strict detection fails, try with relaxed detection
            print("⚠️ Face not detected with strict mode, trying with relaxed detection...")
            try:
                embedding_objs = DeepFace.represent(
                    img_path=temp.name,
                    model_name="Facenet512",
                    enforce_detection=False
                )
                print("✅ Face detected with relaxed mode")
            except FaceNotDetected as e2:
                print("❌ Face not detected even with relaxed mode")
                raise HTTPException(
                    status_code=400,
                    detail="Không phát hiện được khuôn mặt trong ảnh. Vui lòng đảm bảo: (1) Ảnh có khuôn mặt rõ ràng, (2) Ánh sáng đủ, (3) Khuôn mặt không bị che, (4) Camera không bị mờ."
                )
            except Exception as e2:
                print(f"❌ Error in relaxed detection: {str(e2)}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Lỗi khi phát hiện khuôn mặt: {str(e2)}"
                )

        # Check if we got any results
        if not embedding_objs or len(embedding_objs) == 0:
            raise HTTPException(
                status_code=400,
                detail="Không phát hiện được khuôn mặt trong ảnh. Vui lòng chụp ảnh rõ hơn với ánh sáng tốt."
            )

        embedding = embedding_objs[0]["embedding"]
        print(f"✅ Successfully created embedding with {len(embedding)} dimensions")

        return {
            "success": True,
            "embedding": embedding
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise

    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi xử lý ảnh: {str(e)}"
        )

    finally:
        if os.path.exists(temp.name):
            os.unlink(temp.name)