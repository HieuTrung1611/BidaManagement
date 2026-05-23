# Self-Service System - Quick Reference

## 🎯 New API Endpoints

### 1. Face Recognition (Public Access)

```http
POST /api/customers/recognize-face
Content-Type: multipart/form-data

Parameters:
- file: image file (jpg, png)
- branchId: (optional) branch ID

Response:
{
  "matched": true,
  "customer": {
    "id": 5,
    "name": "Nguyễn Văn A",
    "phoneNumber": "0123456789",
    "rank": "SILVER",
    "rankDisplayName": "Bạc"
  },
  "similarity": 0.87,
  "message": "Nhận diện thành công!"
}
```

### 2. Start Self-Service Session (Public Access)

```http
POST /api/sessions/self-service/start
Content-Type: application/json

Body:
{
  "tableId": 1,
  "customerId": 5,
  "customerPhone": "0123456789",
  "notes": "Tự phục vụ"
}

Response:
{
  "id": 123,
  "tableId": 1,
  "tableName": "Bàn 1",
  "customerId": 5,
  "customerName": "Nguyễn Văn A",
  "isSelfService": true,
  "paymentStatus": "UNPAID",
  "status": "ONGOING"
}
```

### 3. Get Unpaid Sessions (Admin Only)

```http
GET /api/sessions/branch/{branchId}/unpaid
Authorization: Bearer {token}

Response:
[
  {
    "id": 123,
    "tableId": 1,
    "tableName": "Bàn 1",
    "customerId": 5,
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0123456789",
    "customerPhoneForDebt": "0987654321",
    "totalAmount": 150000,
    "paymentStatus": "DEBT",
    "isSelfService": true,
    "endTime": "2024-01-15T18:30:00"
  }
]
```

---

## 🖥️ New Frontend Pages

### 1. Self-Service Kiosk

**URL:** `/self-service` (Public)

**Flow:**

1. Click "Bật Camera"
2. Capture face → Auto recognize customer
3. Select table from available list
4. Enter phone number
5. Start session

### 2. Unpaid Sessions Management

**URL:** `/admin/unpaid-sessions` (Admin/Manager)

**Features:**

- View all unpaid sessions
- Customer contact info
- Payment status badges
- Call customers directly

---

## 🗄️ Database Changes

### BilliardSession Table (Auto-applied by Hibernate)

```sql
-- New columns added:
is_self_service BOOLEAN DEFAULT FALSE
payment_status VARCHAR(20) DEFAULT 'PENDING'
customer_phone_for_debt VARCHAR(20)
```

---

## 🔑 Key Features

### Face Recognition

- **Threshold:** 0.6 similarity
- **Model:** Facenet512
- **Dimensions:** 512
- **Method:** Cosine Similarity

### Payment Status Enum

- `PAID` - Đã thanh toán
- `UNPAID` - Chưa thanh toán
- `PENDING` - Đang chờ thanh toán
- `DEBT` - Nợ - Cần liên hệ

---

## 🧪 Testing

### Test Face Recognition

```bash
# Using curl
curl -X POST http://localhost:2911/api/customers/recognize-face \
  -F "file=@photo.jpg" \
  -F "branchId=1"
```

### Test Self-Service Session

```bash
curl -X POST http://localhost:2911/api/sessions/self-service/start \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": 1,
    "customerId": 5,
    "customerPhone": "0123456789"
  }'
```

---

## 🚀 Deployment

### Prerequisites

1. Face AI service running on `localhost:8080`
2. Backend running on `localhost:2911`
3. Frontend running on `localhost:3000`
4. Cloudinary configured with credentials

### Start Services

```bash
# Terminal 1: Face AI
cd face-ai
python run.py

# Terminal 2: Backend
cd backend
./mvnw spring-boot:run

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Access Points

- Self-Service Kiosk: `http://localhost:3000/self-service`
- Admin Panel: `http://localhost:3000/admin/unpaid-sessions`

---

## 🐛 Troubleshooting

### Face Recognition Fails

- ✅ Check Face AI service: `curl http://localhost:8080/face/embedding`
- ✅ Verify customer has photo uploaded
- ✅ Check lighting conditions
- ✅ Ensure face is clearly visible

### Camera Not Working

- ✅ Use HTTPS or localhost
- ✅ Grant camera permissions
- ✅ Try different browser
- ✅ Check camera hardware

### Session Not Starting

- ✅ Verify table is AVAILABLE
- ✅ Check customer ID exists
- ✅ Ensure phone number provided
- ✅ Check backend logs

---

## 📞 Support

For issues or questions, check:

- Backend logs: `backend/logs/`
- Frontend console: Browser DevTools
- Face AI logs: Terminal output
- Full documentation: `SELF_SERVICE_SYSTEM_IMPLEMENTATION.md`
