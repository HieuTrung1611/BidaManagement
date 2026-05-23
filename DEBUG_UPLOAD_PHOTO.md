# Debug Guide: Upload Ảnh Khách Hàng

## Vấn đề hiện tại

Khi upload ảnh khách hàng, có thể gặp lỗi và ảnh không được lưu vào database.

## Nguyên nhân phân tích

### 1. **Flow Upload Ảnh**

```
FE (chụp/chọn ảnh)
  → BE (nhận file)
    → Cloudinary (upload ảnh) ✅
      → Face AI Service (detect mặt + tạo embedding) ❌ (có thể lỗi ở đây)
        → DB (lưu URL + embedding)
```

### 2. **Vấn đề với Transaction**

- Backend sử dụng `@Transactional`
- **Nếu Face AI lỗi** (không detect được mặt, không kết nối được, etc.)
    - → Transaction rollback
    - → **DB không lưu photoUrl**
    - → **NHƯNG Cloudinary đã upload** (không rollback được vì là external service)
    - → Dẫn đến orphan files trên Cloudinary

### 3. **Các nguyên nhân lỗi thường gặp**

#### a) Face AI Service không chạy

```bash
# Kiểm tra Face AI có đang chạy không
cd face-ai
python3 run.py

# Nếu thành công, bạn sẽ thấy:
# INFO:     Uvicorn running on http://0.0.0.0:8080
```

#### b) Face AI không detect được mặt trong ảnh

- Ảnh quá tối
- Không có mặt người trong ảnh
- Góc chụp quá nghiêng
- Độ phân giải quá thấp

#### c) Port conflict

- Face AI chạy port `8080`
- Backend config `FACE_AI_URL=http://localhost:8080`
- **Kiểm tra port có bị chiếm không:**

```bash
lsof -i :8080
```

#### d) CORS issues (nếu deploy production)

```bash
# Kiểm tra .env của face-ai
CORS_ORIGINS=http://localhost:2911
```

## Cách Debug

### Bước 1: Kiểm tra Face AI Service

```bash
# Terminal 1: Chạy Face AI
cd face-ai
python3 run.py

# Test bằng curl
curl -X POST "http://localhost:8080/face/embedding" \
  -F "file=@/path/to/test-image.jpg"
```

**Kết quả mong đợi:**

```json
{
  "success": true,
  "embedding": [0.1234, 0.5678, ...]
}
```

**Nếu lỗi:**

```json
{
    "detail": "Face could not be detected. Please confirm that the picture is a face photo or consider to set enforce_detection param to False."
}
```

### Bước 2: Xem Logs Backend

Sau khi thêm logging, khi upload ảnh bạn sẽ thấy:

```
🔵 [UPLOAD] Bắt đầu upload ảnh lên Cloudinary...
✅ [UPLOAD] Upload Cloudinary thành công: https://...
🔵 [FACE-AI] Bắt đầu tạo embedding từ Face AI...
🔵 [FACE-AI-SERVICE] Chuẩn bị gọi Face AI...
🔵 [FACE-AI-SERVICE] URL: http://localhost:8080/face/embedding
🔵 [FACE-AI-SERVICE] File name: customer-photo-123.jpg
🔵 [FACE-AI-SERVICE] File size: 45678 bytes
```

**Nếu thành công:**

```
✅ [FACE-AI-SERVICE] Face AI response received
✅ [FACE-AI] Tạo embedding thành công
🔵 [DATABASE] Lưu thông tin vào database...
✅ [DATABASE] Lưu database thành công
```

**Nếu lỗi Face AI:**

```
❌ [FACE-AI-SERVICE] Lỗi khi gọi Face AI: ...
❌ [FACE-AI] Lỗi khi tạo embedding: ...
⚠️ [FACE-AI] Tiếp tục lưu ảnh mà không có embedding
🔵 [DATABASE] Lưu thông tin vào database...
✅ [DATABASE] Lưu database thành công
```

### Bước 3: Xem Logs Frontend (Browser Console)

```javascript
📤 Bắt đầu upload ảnh... {customerId: 123, fileName: "...", ...}
✅ Upload ảnh thành công
// hoặc
❌ Lỗi upload ảnh: {...}
Chi tiết lỗi: {status: 500, message: "..."}
```

## Giải pháp đã áp dụng

### 1. ✅ Thêm Logging chi tiết

- Backend: Log từng bước (Cloudinary, Face AI, Database)
- Frontend: Log request/response và errors

### 2. ✅ Graceful Degradation

- **Trước đây:** Face AI lỗi → Rollback toàn bộ → Không lưu gì
- **Bây giờ:** Face AI lỗi → Vẫn lưu ảnh vào DB → `faceEmbedding = null`
    - Cho phép lưu ảnh trước, có thể tạo embedding sau

### 3. ✅ Xử lý lỗi tốt hơn

- Try-catch riêng cho Face AI
- Thông báo lỗi rõ ràng cho user

## Kiểm tra sau khi sửa

### Test Case 1: Upload ảnh có mặt người rõ ràng

✅ Phải thành công hoàn toàn

- Cloudinary có ảnh
- DB có photoUrl
- DB có faceEmbedding

### Test Case 2: Upload ảnh không có mặt người

✅ Phải lưu ảnh được (nhưng không có embedding)

- Cloudinary có ảnh
- DB có photoUrl
- DB có faceEmbedding = null
- Toast warning: "Upload thành công nhưng không detect được mặt"

### Test Case 3: Face AI service không chạy

✅ Phải lưu ảnh được (nhưng không có embedding)

- Tương tự Test Case 2

## Khuyến nghị tiếp theo

### 1. Cleanup Orphan Files

Tạo scheduled job để xóa các file trên Cloudinary không có trong DB

### 2. Retry Embedding

Tạo API để retry tạo embedding cho các ảnh chưa có:

```java
POST /customers/{id}/retry-embedding
```

### 3. Monitoring

- Log lỗi vào file để phân tích
- Đếm số lần Face AI lỗi
- Alert nếu Face AI service down

## Dependencies

### Backend

- Spring Boot WebClient (đã có)
- Cloudinary SDK (đã có)
- Face AI Service (cần chạy)

### Face AI

```bash
cd face-ai
pip install -r requirements.txt
python3 run.py
```

### Frontend

- Axios (đã có)
- Browser getUserMedia API (đã có)

## Ports Summary

- Frontend: `3000` (hoặc `3005`)
- Backend: `2911` (`/api`)
- Face AI: `8080`
- MySQL: `3306`

## Environment Variables Check

### Backend .env

```bash
FACE_AI_URL=http://localhost:8080
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Face AI .env

```bash
PORT=8080
HOST=localhost
CORS_ORIGINS=http://localhost:2911,http://localhost:3000
```

## Troubleshooting Quick Commands

```bash
# 1. Check ports
netstat -tuln | grep -E '8080|2911|3000|3306'

# 2. Test Face AI directly
cd face-ai
python3 -c "from app.services.face_service import create_face_embedding; print('OK')"

# 3. Check backend logs
tail -f backend/logs/spring.log

# 4. Test upload với curl
curl -X POST "http://localhost:2911/api/customers/1/upload-photo" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-face.jpg"
```

## Kết luận

✅ **Đã fix:**

- Thêm logging chi tiết để debug
- Xử lý Face AI lỗi gracefully (vẫn lưu ảnh)
- Frontend log errors rõ ràng

✅ **Bạn đúng về Transaction:**

- Transaction chỉ rollback DB
- Cloudinary đã upload thì không rollback được
- Giải pháp: Try-catch riêng cho Face AI, không để nó crash toàn bộ transaction

🔴 **Cần làm:**

1. Chạy Face AI service: `cd face-ai && python3 run.py`
2. Test upload với ảnh có mặt người rõ
3. Xem console logs để debug
