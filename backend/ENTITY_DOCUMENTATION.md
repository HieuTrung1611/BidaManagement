# Entity Architecture Documentation

## Overview

Hệ thống quản lý quán billiards được thiết kế với các entity sau để hỗ trợ đầy đủ các chức năng kinh doanh.

---

## Danh sách Entity

### 1. **User** (Người dùng hệ thống)

- **Fields:**
    - `username`: Tên đăng nhập (unique)
    - `password`: Mật khẩu
    - `email`: Email (unique)
    - `role`: Vai trò (UserRole enum)
    - `isActive`: Trạng thái kích hoạt
- **Purpose:** Quản lý tài khoản người dùng hệ thống

### 2. **Branch** (Chi nhánh)

- **Fields:**
    - `name`: Tên chi nhánh (unique)
    - `address`: Địa chỉ
    - `description`: Mô tả
    - `isActive`: Trạng thái
- **Relationships:**
    - OneToMany: Employee, TableBilliard, Customer, Service, Combo, Invoice, etc.
- **Purpose:** Quản lý các chi nhánh của chuỗi quán billiards

### 3. **Employee** (Nhân viên)

- **Fields:**
    - `name`: Tên nhân viên
    - `email`: Email (unique)
    - `phoneNumber`: Số điện thoại (unique)
    - `dob`: Ngày sinh
    - `address`: Địa chỉ
    - `identityNumber`: Số CMND/CCCD
    - `bankAccount`: Số tài khoản ngân hàng
    - `bankName`: Tên ngân hàng
    - `hireDate`: Ngày bắt đầu làm việc
    - `salaryType`: Loại lương (FIXED, HOURLY, COMMISSION)
    - `baseSalary`: Lương cơ bản
    - `emergencyContactName`: Tên liên lạc khẩn cấp
    - `emergencyContactPhone`: SĐT liên lạc khẩn cấp
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: EmployeePosition, Branch
    - OneToMany: Attendance, Salary
- **Purpose:** Quản lý thông tin nhân viên

### 4. **EmployeePosition** (Chức vụ nhân viên)

- **Fields:**
    - `name`: Tên chức vụ
    - `code`: Mã chức vụ (unique)
    - `hourlyRate`: Mức lương/giờ
- **Purpose:** Định nghĩa các chức vụ và mức lương tương ứng

### 5. **Attendance** (Chấm công)

- **Fields:**
    - `attendanceDate`: Ngày chấm công
    - `status`: Trạng thái (PRESENT, ABSENT, LATE, EARLY_LEAVE)
    - `workingHours`: Số giờ làm việc
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: Employee
- **Purpose:** Theo dõi chấm công nhân viên hàng ngày

### 6. **Salary** (Bảng lương)

- **Fields:**
    - `salaryMonth`: Tháng lương (YYYY-MM)
    - `baseSalary`: Lương cơ bản
    - `bonus`: Thưởng
    - `deduction`: Khấu trừ
    - `totalSalary`: Tổng lương
    - `workingDays`: Số ngày làm việc
    - `workingHours`: Số giờ làm việc
    - `isPaid`: Đã thanh toán chưa
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: Employee
- **Purpose:** Quản lý và tính toán lương nhân viên theo tháng

### 7. **Customer** (Khách hàng)

- **Fields:**
    - `name`: Tên khách hàng
    - `email`: Email (unique)
    - `phoneNumber`: Số điện thoại (unique)
    - `address`: Địa chỉ
    - `rank`: Xếp hạng khách hàng (BRONZE, SILVER, GOLD, PLATINUM)
        - BRONZE: 0% discount
        - SILVER: 5% discount
        - GOLD: 10% discount
        - PLATINUM: 15% discount
    - `totalSpent`: Tổng tiền đã chi tiêu
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: Branch
    - OneToMany: BilliardSession, Invoice
- **Purpose:** Quản lý thông tin khách hàng và xếp hạng để áp dụng discount

### 8. **TableBilliard** (Bàn billiards)

- **Fields:**
    - `name`: Tên bàn (unique)
    - `description`: Mô tả
    - `pricePerHour`: Giá/giờ
    - `status`: Trạng thái (AVAILABLE, IN_USE, MAINTENANCE, RESERVED)
- **Relationships:**
    - ManyToOne: TableBilliardType, Branch
    - OneToMany: BilliardSession, TableStatusHistory
- **Purpose:** Quản lý bàn billiards và trạng thái của chúng

### 9. **TableBilliardType** (Loại bàn billiards)

- **Fields:**
    - `name`: Tên loại
    - `description`: Mô tả
    - `costPrice`: Giá nhập
    - `supplier`: Nhà cung cấp
    - `supplierPhone`: SĐT nhà cung cấp
- **Purpose:** Định nghĩa các loại bàn billiards

### 10. **TableStatusHistory** (Lịch sử thay đổi trạng thái bàn)

- **Fields:**
    - `oldStatus`: Trạng thái cũ
    - `newStatus`: Trạng thái mới
    - `changedAt`: Thời gian thay đổi
    - `reason`: Lý do thay đổi
- **Relationships:**
    - ManyToOne: TableBilliard, Branch
- **Purpose:** Ghi lại chi tiết mỗi lần thay đổi trạng thái bàn

### 11. **BilliardSession** (Phiên chơi billiards)

- **Fields:**
    - `startTime`: Thời gian bắt đầu
    - `endTime`: Thời gian kết thúc
    - `durationHours`: Thời lượng chơi (giờ)
    - `status`: Trạng thái phiên (ONGOING, COMPLETED, CANCELLED)
    - `totalAmount`: Tổng tiền phát sinh (bao gồm giờ chơi, combo, dịch vụ)
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: TableBilliard, Customer, Branch
    - OneToMany: SessionService, SessionCombo, Invoice
- **Purpose:** Quản lý mỗi phiên chơi

### 12. **Service** (Dịch vụ)

- **Fields:**
    - `name`: Tên dịch vụ
    - `description`: Mô tả
    - `type`: Loại (STICK_RENTAL, FOOD, BEVERAGE)
    - `price`: Giá dịch vụ
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: Branch
    - OneToMany: SessionService, Inventory, ComboService
- **Purpose:** Quản lý các dịch vụ (thuê gậy, đồ ăn, đồ uống)

### 13. **SessionService** (Chi tiết dịch vụ trong phiên)

- **Fields:**
    - `quantity`: Số lượng
    - `price`: Giá tại thời điểm đặt
    - `totalAmount`: Tổng = quantity \* price
- **Relationships:**
    - ManyToOne: BilliardSession, Service
- **Purpose:** Lưu trữ chi tiết các dịch vụ được sử dụng trong một phiên

### 14. **Combo** (Combo chơi)

- **Fields:**
    - `name`: Tên combo
    - `description`: Mô tả
    - `durationHours`: Số giờ chơi
    - `price`: Giá combo
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: Branch
    - OneToMany: SessionCombo, ComboService
- **Purpose:** Quản lý các combo chơi theo giờ

### 15. **ComboService** (Chi tiết dịch vụ trong combo)

- **Fields:**
    - `quantity`: Số lượng dịch vụ trong combo
- **Relationships:**
    - ManyToOne: Combo, Service
- **Purpose:** Định nghĩa các dịch vụ bao gồm trong mỗi combo

### 16. **SessionCombo** (Chi tiết combo trong phiên)

- **Fields:**
    - `quantity`: Số lượng combo
    - `price`: Giá combo tại thời điểm đặt
    - `totalAmount`: Tổng = quantity \* price
- **Relationships:**
    - ManyToOne: BilliardSession, Combo
- **Purpose:** Lưu trữ chi tiết các combo được sử dụng trong một phiên

### 17. **Inventory** (Tồn kho)

- **Fields:**
    - `quantity`: Số lượng tồn kho
    - `minQuantity`: Số lượng tối thiểu (để cảnh báo)
    - `costPrice`: Giá nhập
    - `supplier`: Nhà cung cấp
    - `supplierPhone`: SĐT nhà cung cấp
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: Service, Branch
    - OneToMany: InventoryMovement
- **Purpose:** Quản lý tồn kho cho đồ ăn, đồ uống

### 18. **InventoryMovement** (Lịch sử thay đổi tồn kho)

- **Fields:**
    - `quantityChange`: Lượng thay đổi (+/-)
    - `movementType`: Loại (IN, OUT, ADJUST)
    - `movementDate`: Ngày thay đổi
    - `reason`: Lý do thay đổi
    - `reference`: Tham chiếu (SDT, Hóa đơn, ...)
- **Relationships:**
    - ManyToOne: Inventory, Branch
- **Purpose:** Ghi lại chi tiết mỗi lần thay đổi tồn kho

### 19. **Invoice** (Hóa đơn)

- **Fields:**
    - `invoiceNumber`: Số hóa đơn (unique)
    - `invoiceDate`: Ngày lập hóa đơn
    - `subtotal`: Tổng tiền trước giảm giá
    - `discountPercent`: % giảm giá (từ rank khách hàng)
    - `discountAmount`: Số tiền giảm
    - `totalAmount`: Tổng tiền sau giảm giá
    - `status`: Trạng thái (PENDING, COMPLETED, CANCELLED, REFUNDED)
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: BilliardSession, Customer, Branch
    - OneToMany: InvoiceDetail
- **Purpose:** Lập hóa đơn thanh toán cho mỗi phiên chơi

### 20. **InvoiceDetail** (Chi tiết hóa đơn)

- **Fields:**
    - `itemDescription`: Mô tả mục (giờ chơi, dịch vụ, combo, ...)
    - `quantity`: Số lượng
    - `unitPrice`: Giá đơn vị
    - `totalPrice`: Tổng = quantity \* unitPrice
    - `notes`: Ghi chú
- **Relationships:**
    - ManyToOne: Invoice
- **Purpose:** Lưu trữ chi tiết các mục trong hóa đơn

### 21. **ExtraCharge** (Chi phí phụ)

- **Fields:**
    - `name`: Tên khoảng thêm
    - `description`: Mô tả
    - `chargeAmount`: Số tiền phụ phí
    - `chargeType`: Loại tính ("PER_HOUR", "PER_MINUTE", "FIXED")
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: Branch
- **Purpose:** Quản lý các chi phí phụ (vd: chơi quá giờ, ...)

### 22. **DiscountPolicy** (Chính sách giảm giá)

- **Fields:**
    - `name`: Tên chương trình
    - `description`: Mô tả
    - `discountPercent`: % giảm giá
    - `startDate`: Ngày bắt đầu
    - `endDate`: Ngày kết thúc
    - `minAmount`: Giá trị tối thiểu để áp dụng
    - `isActive`: Trạng thái
- **Relationships:**
    - ManyToOne: Branch
- **Purpose:** Quản lý các chương trình khuyến mãi đặc biệt

### 23. **BranchImage** (Hình ảnh chi nhánh)

- **Fields:**
    - `url`: URL hình ảnh
    - `publicId`: ID công khai (từ Cloudinary, ...)
- **Relationships:**
    - ManyToOne: Branch
- **Purpose:** Lưu trữ hình ảnh chi nhánh

---

## Enums

### 1. **UserRole**

- ADMIN
- MANAGER
- STAFF

### 2. **CustomerRank**

- BRONZE (0% discount)
- SILVER (5% discount)
- GOLD (10% discount)
- PLATINUM (15% discount)

### 3. **TableStatus**

- AVAILABLE (Bàn trống)
- IN_USE (Đang sử dụng)
- MAINTENANCE (Đang bảo trì)
- RESERVED (Đã đặt trước)

### 4. **SessionStatus**

- ONGOING (Đang diễn ra)
- COMPLETED (Hoàn thành)
- CANCELLED (Bị hủy)

### 5. **AttendanceStatus**

- PRESENT (Có mặt)
- ABSENT (Vắng)
- LATE (Đi trễ)
- EARLY_LEAVE (Về sớm)

### 6. **InvoiceStatus**

- PENDING (Chờ thanh toán)
- COMPLETED (Đã thanh toán)
- CANCELLED (Bị hủy)
- REFUNDED (Hoàn tiền)

### 7. **SalaryType**

- FIXED (Lương cố định)
- HOURLY (Tính theo giờ)
- COMMISSION (Tính hoa hồng)

### 8. **ServiceType**

- STICK_RENTAL (Thuê gậy)
- FOOD (Đồ ăn)
- BEVERAGE (Đồ uống)

---

## Workflow Quy Trình Thanh Toán

```
1. Khách hàng đến quán
   └─> Tạo Customer (nếu chưa có)
       └─> System đưa ra CustomerRank (dựa trên totalSpent)

2. Khách hàng chọn bàn
   └─> TableBilliard.status = AVAILABLE → IN_USE
       └─> Tạo BilliardSession
           ├─> Ghi startTime
           ├─> Có thể thêm SessionCombo
           └─> Có thể thêm SessionService

3. Trong quá trình chơi
   └─> Tính durationHours
       ├─> baseAmount = durationHours * pricePerHour
       ├─> Cộng thêm SessionCombo.totalAmount
       └─> Cộng thêm SessionService.totalAmount

4. Kết thúc phiên chơi
   └─> BilliardSession.status = COMPLETED
       ├─> Tính discountPercent từ Customer.rank
       ├─> Tạo Invoice
       │   ├─> subtotal = baseAmount + combos + services
       │   ├─> discountAmount = subtotal * discountPercent / 100
       │   └─> totalAmount = subtotal - discountAmount
       ├─> Tạo InvoiceDetail chi tiết
       └─> TableBilliard.status = AVAILABLE

5. Thanh toán
   └─> Invoice.status = COMPLETED
       └─> Cập nhật Customer.totalSpent
           └─> Có thể nâng Customer.rank (nếu đủ điều kiện)
```

---

## Quy Trình Tính Lương Nhân Viên

```
1. Admin bắt đầu tính lương tháng
   └─> Xem tất cả Attendance của tháng đó

2. Hệ thống tính toán
   ├─> Đếm số ngày có mặt, muộn, sớm, vắng
   ├─> Tính workingDays và workingHours
   └─> baseSalary từ Employee.baseSalary hoặc
       ├─> Nếu SalaryType = FIXED: Lương cố định
       ├─> Nếu SalaryType = HOURLY: workingHours * hourlyRate
       └─> Nếu SalaryType = COMMISSION: % doanh số

3. Tính thưởng/khấu trừ
   ├─> bonus (nếu có kế hoạch khuyến khích)
   └─> deduction (nếu vắng, muộn, ...)

4. Tạo bản ghi Salary
   └─> totalSalary = baseSalary + bonus - deduction

5. Thanh toán lương
   └─> Salary.isPaid = true
```

---

## Database Notes

- Tất cả entity kế thừa từ `BaseEntity` có audit fields: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Sử dụng `@ManyToOne(fetch = FetchType.LAZY)` để tối ưu hiệu suất
- Các trường duy nhất (unique) được chỉ định để tránh trùng lặp
- Các quan hệ OneToMany có `mappedBy` để duy trì hai chiều relationship

---

## Recommendations

1. Thêm indexes cho các trường thường xuyên được query (phone, email, invoiceNumber, ...)
2. Thêm validation constraints (min, max, length, ...) vào các fields
3. Tạo các views/queries phục vụ báo cáo (doanh số theo tháng, lương nhân viên, ...)
4. Cân nhắc thêm caching cho dữ liệu thường xuyên truy vấn (TableBilliard, Combo, Service, ...)
5. Thêm soft delete cho các entity quan trọng (Employee, Customer, Service, ...)
6. Tạo audit logging chi tiết cho các giao dịch tài chính (Invoice, Salary, ...)
