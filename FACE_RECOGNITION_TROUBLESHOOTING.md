# Face Recognition - Xử Lý Lỗi và Troubleshooting

## 🔍 Các trường hợp lỗi thường gặp

### 1. **"Face could not be detected" (Không phát hiện được khuôn mặt)**

#### Nguyên nhân:

- ❌ Ảnh không có khuôn mặt rõ ràng
- ❌ Ánh sáng quá tối hoặc quá sáng
- ❌ Khuôn mặt bị che (khẩu trang, kính, mũ)
- ❌ Góc chụp nghiêng quá nhiều
- ❌ Camera bị mờ/bẩn
- ❌ Ảnh có nhiều khuôn mặt (DeepFace sẽ chọn khuôn mặt lớn nhất)

#### Cơ chế xử lý:

```
1. Thử detect với strict mode (enforce_detection=True)
   ↓
2. Nếu thất bại → Thử relaxed mode (enforce_detection=False)
   ↓
3. Nếu vẫn thất bại → Trả về lỗi 400 với hướng dẫn
```

#### Giải pháp:

- ✅ Đảm bảo ánh sáng đủ (tránh ánh sáng mạnh từ phía sau)
- ✅ Khuôn mặt nhìn thẳng vào camera
- ✅ Không đeo khẩu trang, kính râm, mũ
- ✅ Camera sạch, không bị mờ
- ✅ Chụp từ khoảng cách 30-50cm

---

### 2. **"Không tìm thấy khách hàng phù hợp (độ tương đồng thấp)"**

#### Nguyên nhân:

- ❌ Khách hàng chưa đăng ký khuôn mặt trong hệ thống
- ❌ Độ tương đồng (similarity) < 0.5 (ngưỡng threshold)
- ❌ Ảnh đăng ký và ảnh quét khác nhau nhiều (góc độ, ánh sáng, biểu cảm)
- ❌ Khuôn mặt thay đổi (râu, tóc, tuổi tác)

#### Cơ chế tính similarity:

```javascript
Cosine Similarity = (A · B) / (||A|| * ||B||)

Kết quả:
- 1.0 = Giống hệt 100%
- 0.9-0.99 = Rất giống (cùng 1 người)
- 0.7-0.89 = Khá giống
- 0.5-0.69 = Giống vừa phải (ngưỡng an toàn)
- < 0.5 = Khác biệt (người khác)
```

#### Threshold hiện tại:

- **0.5** (50% similarity) - Giảm từ 0.6 để dễ match hơn

#### Giải pháp:

1. **Kiểm tra khách hàng đã đăng ký chưa:**
    - Vào quản lý khách hàng
    - Tìm khách hàng
    - Xem có ảnh và faceEmbedding chưa

2. **Đăng ký lại khuôn mặt:**
    - Chụp ảnh mới với điều kiện tốt hơn
    - Đảm bảo biểu cảm tự nhiên, không cười quá
    - Ánh sáng đều, không quá sáng/tối

3. **Log để debug:**
    ```bash
    # Backend sẽ in ra console:
    🔵 [FACE-RECOGNITION] Customer 1 (Nguyễn Văn A): similarity = 0.4523
    🔵 [FACE-RECOGNITION] Customer 2 (Trần Thị B): similarity = 0.8912
    ✅ [FACE-RECOGNITION] Match found: Customer 2 with similarity 0.8912
    ```

---

### 3. **Nhiều khách hàng có cùng khuôn mặt (Duplicate Embeddings)**

#### Trường hợp:

Khi 2 hoặc nhiều khách hàng **đăng ký cùng 1 khuôn mặt** (ví dụ: test, hoặc nhầm lẫn).

#### Biểu hiện:

```
⚠️ [FACE-RECOGNITION] Potential duplicate embedding detected for customer 123
⚠️ [FACE-RECOGNITION] WARNING: 2 customers have very similar face embeddings. IDs: 45, 123
```

#### Cơ chế phát hiện:

```java
// Nếu 2 customer có similarity >= 0.95 và chênh lệch < 0.01
if (similarity >= 0.95 && bestSimilarity >= 0.95
    && Math.abs(similarity - bestSimilarity) < 0.01) {
    duplicateMatches.add(customer);
    // Log warning
}
```

#### Kết quả:

- ✅ Hệ thống vẫn nhận diện được (chọn customer nào được duyệt sau)
- ⚠️ Hiển thị cảnh báo: **"Nhận diện thành công! (Cảnh báo: Có 2 khách hàng có khuôn mặt giống nhau)"**
- 📝 Log ghi lại tất cả customer IDs bị duplicate

#### Giải pháp:

1. **Kiểm tra và xóa duplicate:**

    ```sql
    -- Tìm customers có photoUrl giống nhau
    SELECT photoUrl, COUNT(*) as count, GROUP_CONCAT(id) as customer_ids
    FROM customers
    WHERE faceEmbedding IS NOT NULL
    GROUP BY photoUrl
    HAVING count > 1;
    ```

2. **Xóa faceEmbedding của customer không đúng:**
    - Vào quản lý khách hàng
    - Tìm customer bị nhầm
    - Xóa ảnh và đăng ký lại với ảnh đúng

3. **Chụp lại ảnh riêng biệt:**
    - Mỗi khách hàng phải có ảnh riêng
    - Không dùng chung ảnh test

---

## 📊 Flow xử lý chi tiết

### A. Upload và lưu faceEmbedding (Customer Creation/Update)

```
1. User upload ảnh qua CustomerModal
   ↓
2. Frontend gửi ảnh đến /customers (create/update)
   ↓
3. Backend upload ảnh lên Cloudinary → photoUrl
   ↓
4. Backend gọi Face AI: POST /face/embedding
   │
   ├─ Face AI: DeepFace.represent() với enforce_detection=True
   │  ├─ ✅ Success → return embedding (512 dimensions)
   │  └─ ❌ FaceNotDetected → retry với enforce_detection=False
   │     ├─ ✅ Success → return embedding
   │     └─ ❌ Still fail → return 400 error
   ↓
5. Backend lưu embedding vào customer.faceEmbedding (JSON string)
   ↓
6. Frontend hiển thị thành công
```

**Lưu ý:**

- ❌ Nếu Face AI lỗi → faceEmbedding = null, photoUrl vẫn được lưu
- ✅ Graceful degradation: Khách hàng vẫn được tạo, chỉ thiếu face recognition

---

### B. Nhận diện khuôn mặt (Face Recognition)

```
1. User quét mặt từ SessionDetailCard
   ↓
2. Frontend chụp ảnh từ camera → gửi đến /customers/recognize-face
   ↓
3. Backend gọi Face AI: POST /face/embedding
   ↓
4. Face AI extract embedding từ ảnh quét
   ↓
5. Backend lấy tất cả customers có faceEmbedding trong branch
   ↓
6. So sánh embedding với từng customer (Cosine Similarity)
   │
   ├─ similarity >= 0.5 → MATCH ✅
   │  ├─ Kiểm tra duplicate (>= 0.95)
   │  ├─ Log warning nếu có duplicate
   │  └─ Trả về customer info + similarity
   │
   └─ similarity < 0.5 → NO MATCH ❌
      └─ Trả về thông báo "Không tìm thấy khách hàng phù hợp"
```

---

## 🛠️ Debug Tools

### 1. Kiểm tra Face AI service

```bash
# Test Face AI endpoint
curl -X POST "http://localhost:8080/face/embedding" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/face.jpg"

# Expected response:
{
  "success": true,
  "embedding": [0.123, -0.456, ...]  // 512 numbers
}
```

### 2. Kiểm tra faceEmbedding trong database

```sql
-- Khách hàng nào đã có faceEmbedding?
SELECT id, name, phoneNumber, photoUrl,
       CASE WHEN faceEmbedding IS NOT NULL THEN 'YES' ELSE 'NO' END as has_embedding
FROM customers
WHERE branch_id = 1;

-- Xem độ dài embedding (phải là 512)
SELECT id, name,
       JSON_LENGTH(faceEmbedding) as embedding_dimensions
FROM customers
WHERE faceEmbedding IS NOT NULL;
```

### 3. Backend logs

Khi nhận diện, backend sẽ log:

```
🔵 [FACE-RECOGNITION] Starting face recognition for branch: 1
🔵 [FACE-RECOGNITION] Calling Face AI to extract embedding...
🔵 [FACE-RECOGNITION] Got embedding with 512 dimensions
🔵 [FACE-RECOGNITION] Found 5 customers with face embeddings
🔵 [FACE-RECOGNITION] Customer 1 (Nguyễn Văn A): similarity = 0.4523
🔵 [FACE-RECOGNITION] Customer 2 (Trần Thị B): similarity = 0.8912
🔵 [FACE-RECOGNITION] Customer 3 (Lê Văn C): similarity = 0.3201
✅ [FACE-RECOGNITION] Match found: Customer 2 (Trần Thị B) with similarity 0.8912
```

Nếu có duplicate:

```
⚠️ [FACE-RECOGNITION] Potential duplicate embedding detected for customer 123 (similarity: 0.9812)
⚠️ [FACE-RECOGNITION] WARNING: 2 customers have very similar face embeddings. IDs: 45, 123
```

---

## 🎯 Best Practices

### 1. Khi đăng ký khuôn mặt:

- ✅ Ánh sáng đều, tự nhiên (không quá sáng/tối)
- ✅ Khuôn mặt nhìn thẳng, biểu cảm tự nhiên
- ✅ Không đeo khẩu trang, kính, mũ
- ✅ Khoảng cách 30-50cm từ camera
- ✅ Camera sạch, không bị mờ

### 2. Khi quét mặt:

- ✅ Điều kiện tương tự lúc đăng ký
- ✅ Biểu cảm tự nhiên (không khác quá so với ảnh đăng ký)
- ✅ Nếu thất bại → thử quét lại trong điều kiện ánh sáng tốt hơn

### 3. Quản lý dữ liệu:

- ✅ Định kỳ kiểm tra duplicate embeddings
- ✅ Xóa test data sau khi test xong
- ✅ Backup database trước khi xóa face data
- ✅ Cập nhật ảnh khi khách hàng thay đổi ngoại hình nhiều

### 4. Điều chỉnh threshold (nếu cần):

```java
// Trong CustomerServiceImpl.java, line ~325
double threshold = 0.5; // Giá trị từ 0.4 - 0.7

// 0.4 = Dễ match (có thể nhận nhầm)
// 0.5 = Cân bằng (recommended) ✅
// 0.6 = Khó match (bỏ sót nhiều)
// 0.7 = Rất khó match (chỉ khi ảnh giống hệt)
```

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra logs backend và Face AI
2. Kiểm tra database (faceEmbedding, photoUrl)
3. Test Face AI endpoint riêng
4. Kiểm tra điều kiện chụp ảnh (ánh sáng, góc độ)
5. Thử giảm threshold xuống 0.45 nếu quá khó match

---

**Cập nhật:** 25/05/2026  
**Threshold hiện tại:** 0.5 (giảm từ 0.6)  
**Duplicate detection:** Enabled (>= 0.95 similarity)
