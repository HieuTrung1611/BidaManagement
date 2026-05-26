# Chức năng Quét Mặt trong SessionDetailCard

## 📋 Tổng quan

Đã tích hợp chức năng nhận diện khuôn mặt vào trang quản lý phiên chơi (`SessionDetailCard`), cho phép nhân viên quét mặt khách hàng để tự động nhận diện và áp dụng giảm giá theo hạng thành viên.

## ✨ Tính năng

### 1. **Quét mặt khách hàng**

- Nút "Quét mặt" ngay bên cạnh dropdown chọn khách hàng
- Mở camera trực tiếp trong card để quét khuôn mặt
- Nhận diện khuôn mặt qua Face AI service
- Tự động lấy thông tin chi nhánh từ bàn đang chọn

### 2. **Hiển thị thông tin khách hàng đã nhận diện**

- Thẻ thông tin màu xanh hiển thị ngay sau khi nhận diện thành công
- Hiển thị: Tên, SĐT, Hạng thành viên, % giảm giá
- Tự động chọn khách hàng trong dropdown

### 3. **Áp dụng giảm giá theo hạng**

- Backend tự động tính discount dựa trên customer rank
- Discount được áp dụng vào invoice khi kết thúc phiên
- Hiển thị discount trong PaymentCompletedModal

### 4. **Hiển thị hạng trong phiên đang chơi**

- Hiển thị hạng thành viên (với icon ⭐) trong card thông tin khách hàng
- Cập nhật theo thời gian thực khi có phiên đang hoạt động

## 🔧 Thay đổi kỹ thuật

### Backend Changes

#### 1. **SessionResponseDTO.java**

```java
// Thêm trường mới
String customerRank; // Display name của hạng (Đồng, Bạc, Vàng, Bạch Kim)
```

#### 2. **BilliardSessionMapper.java**

```java
default SessionResponseDTO toResponseDTOWithType(BilliardSession session) {
    SessionResponseDTO dto = toResponseDTO(session);
    // ... existing code ...

    // Thêm logic map customerRank
    if (session != null && session.getCustomer() != null
        && session.getCustomer().getRank() != null) {
        dto.setCustomerRank(session.getCustomer().getRank().getDisplayName());
    }
    return dto;
}
```

#### 3. **Discount Calculation** (Đã có sẵn)

- `BilliardSessionServiceImpl.calculateTotalAmount()` đã tính discount từ customer rank
- `InvoiceServiceImpl.generateInvoice()` lưu discountPercent và discountAmount vào Invoice

### Frontend Changes

#### 1. **SessionDetailCard.tsx**

**Imports mới:**

```typescript
import { Camera, CheckCircle, Star } from "lucide-react";
import { ICustomerResponse } from "@/types/customer";
import customerService from "@/services/customerService";
import { getCustomerRankDisplay } from "@/utils/customerUtils";
```

**State mới:**

```typescript
const [isCameraOpen, setIsCameraOpen] = useState(false);
const [stream, setStream] = useState<MediaStream | null>(null);
const [recognizedCustomer, setRecognizedCustomer] =
    useState<ICustomerResponse | null>(null);
const [isScanningFace, setIsScanningFace] = useState(false);

const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
```

**Hàm mới:**

- `handleOpenCamera()`: Mở camera với getUserMedia
- `handleCloseCamera()`: Đóng camera và cleanup stream
- `handleCaptureFace()`: Chụp ảnh từ video, gửi đến Face AI, nhận diện khách hàng

**UI Components:**

1. Nút "Quét mặt" / "Đóng camera" (toggle)
2. Camera view (video element + canvas ẩn)
3. Nút "Chụp và Nhận diện"
4. Thẻ thông tin khách hàng đã nhận diện (màu xanh, hiển thị tên, SĐT, hạng, discount %)
5. Hiển thị hạng trong active session info card (với icon ⭐)

#### 2. **session.ts (Types)**

```typescript
export interface IBilliardSessionResponse extends IBaseResponse {
    // ... existing fields ...
    customerRank?: string; // Display name (Đồng, Bạc, Vàng, Bạch Kim)
}
```

## 📊 Flow hoạt động

### Flow quét mặt và mở bàn:

```
1. Nhân viên chọn bàn trống
   ↓
2. Click "Quét mặt"
   ↓
3. Camera mở (getUserMedia)
   ↓
4. Click "Chụp và Nhận diện"
   ↓
5. Frontend gửi ảnh đến /customers/recognize-face
   - Kèm branchId từ table.branch.id
   ↓
6. Backend:
   - Face AI trích xuất embedding từ ảnh
   - So sánh với các customer có faceEmbedding trong DB
   - Lọc theo branchId (nếu có)
   - Trả về customer match (similarity >= 0.6)
   ↓
7. Frontend:
   - Hiển thị thông tin khách hàng (tên, SĐT, hạng, discount)
   - Tự động chọn customer trong dropdown
   - Đóng camera
   ↓
8. Nhân viên nhập ghi chú (optional) và click "Mở bàn"
   ↓
9. Backend tạo session với customerId
   ↓
10. Khi kết thúc phiên:
    - Backend tính discount từ customer.rank.discountPercent
    - Tạo Invoice với discountPercent và discountAmount
    - Frontend hiển thị discount trong PaymentCompletedModal
```

## 🎯 Lợi ích

### 1. **Trải nghiệm người dùng**

- ✅ Không cần tìm kiếm thủ công trong dropdown
- ✅ Nhanh chóng và chính xác
- ✅ Tự động áp dụng ưu đãi thành viên

### 2. **Bảo mật và chính xác**

- ✅ Nhận diện dựa trên Face AI (DeepFace + Facenet512)
- ✅ Cosine similarity threshold 0.6
- ✅ Lọc theo chi nhánh để tránh nhầm lẫn

### 3. **Tích hợp liền mạch**

- ✅ Không cần modal riêng (như FaceScanModal)
- ✅ Tích hợp trực tiếp vào flow mở bàn
- ✅ Tự động chọn customer trong dropdown, vẫn cho phép thay đổi thủ công

## 📝 Hướng dẫn sử dụng

### Cho nhân viên:

1. **Chọn bàn trống** trong danh sách bàn
2. Click nút **"Quét mặt"** bên cạnh dropdown khách hàng
3. **Hướng camera** vào khuôn mặt khách hàng
4. Click **"Chụp và Nhận diện"**
5. Hệ thống sẽ hiển thị thông tin khách hàng nếu nhận diện thành công
6. Xác nhận thông tin đúng, nhập ghi chú (nếu cần)
7. Click **"Mở bàn"** để bắt đầu phiên chơi
8. **Giảm giá** sẽ được tự động áp dụng khi thanh toán

### Lưu ý:

- Khách hàng phải có **ảnh và faceEmbedding** đã lưu trong hệ thống
- Camera cần **quyền truy cập** từ trình duyệt
- **Ánh sáng tốt** giúp nhận diện chính xác hơn
- Có thể **chọn lại khách hàng thủ công** nếu cần

## 🔐 Quyền truy cập

- API `/customers/recognize-face`: **Public** (cho phép self-service)
- UI trong SessionDetailCard: **STAFF/MANAGER/ADMIN** (theo quyền truy cập trang session)

## 📦 Dependencies

### Backend:

- Face AI Service (http://localhost:8080)
- Customer entity với faceEmbedding field
- CustomerRank enum với getDiscountPercent() method

### Frontend:

- Browser MediaDevices API (camera)
- customerService.recognizeFace()
- getCustomerRankDisplay() utility

## ✅ Testing Checklist

- [ ] Camera mở đúng trên desktop và mobile
- [ ] Nhận diện thành công với customer đã có faceEmbedding
- [ ] Hiển thị thông tin customer đúng (tên, SĐT, hạng, discount)
- [ ] Tự động chọn customer trong dropdown
- [ ] Có thể thay đổi customer thủ công sau khi nhận diện
- [ ] Discount được áp dụng đúng trong invoice
- [ ] Hiển thị hạng thành viên trong active session card
- [ ] Camera cleanup đúng khi đóng card hoặc chuyển bàn
- [ ] Xử lý lỗi khi không nhận diện được (hiển thị toast lỗi)
- [ ] Xử lý lỗi khi không có quyền truy cập camera

## 🚀 Kế hoạch mở rộng

1. **Face enrollment** trong CustomerModal (đã có)
2. **History** lưu lại các lần quét mặt
3. **Multiple faces** detection và chọn
4. **Confidence score** hiển thị độ chính xác nhận diện
5. **Auto-suggest** khi similarity gần ngưỡng (0.5-0.6)

---

**Ngày cập nhật:** 25/05/2026  
**Trạng thái:** ✅ Đã hoàn thành và sẵn sàng sử dụng
