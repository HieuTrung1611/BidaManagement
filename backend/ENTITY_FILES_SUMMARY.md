# Entity Files Summary

## Created Entities (Total: 23)

### Core Entities

1. **User.java** - Người dùng hệ thống
2. **Branch.java** - Chi nhánh (đã đúc sẳn)
3. **BranchImage.java** - Hình ảnh chi nhánh (đã có)

### Employee Management (Quản lý nhân viên)

4. **Employee.java** - Thông tin nhân viên (đã chỉnh sửa - thêm salary fields)
5. **EmployeePosition.java** - Chức vụ nhân viên (đã có)
6. **Attendance.java** - Chấm công
7. **Salary.java** - Bảng lương

### Customer Management (Quản lý khách hàng)

8. **Customer.java** - Thông tin khách hàng (kèm rank enum)

### Table Management (Quản lý bàn billiards)

9. **TableBilliard.java** - Bàn billiards (đã chỉnh sửa - thêm status)
10. **TableBilliardType.java** - Loại bàn billiards (đã có)
11. **TableStatusHistory.java** - Lịch sử thay đổi trạng thái bàn

### Session Management (Quản lý phiên chơi)

12. **BilliardSession.java** - Phiên chơi billiards

### Service Management (Quản lý dịch vụ)

13. **Service.java** - Dịch vụ (thuê gậy, đồ ăn, đồ uống)
14. **SessionService.java** - Chi tiết dịch vụ trong phiên

### Combo Management (Quản lý combo)

15. **Combo.java** - Combo chơi
16. **ComboService.java** - Chi tiết dịch vụ trong combo
17. **SessionCombo.java** - Chi tiết combo trong phiên

### Inventory Management (Quản lý tồn kho)

18. **Inventory.java** - Tồn kho (cho đồ ăn, đồ uống)
19. **InventoryMovement.java** - Lịch sử thay đổi tồn kho

### Invoice Management (Quản lý hóa đơn)

20. **Invoice.java** - Hóa đơn thanh toán
21. **InvoiceDetail.java** - Chi tiết hóa đơn

### Support Entities (Entities phụ trợ)

22. **ExtraCharge.java** - Chi phí phụ
23. **DiscountPolicy.java** - Chính sách giảm giá

---

## Created Enums (Total: 8)

1. **CustomerRank.java** - Xếp hạng khách hàng (BRONZE, SILVER, GOLD, PLATINUM)
2. **TableStatus.java** - Trạng thái bàn (AVAILABLE, IN_USE, MAINTENANCE, RESERVED)
3. **SessionStatus.java** - Trạng thái phiên (ONGOING, COMPLETED, CANCELLED)
4. **AttendanceStatus.java** - Trạng thái chấm công (PRESENT, ABSENT, LATE, EARLY_LEAVE)
5. **InvoiceStatus.java** - Trạng thái hóa đơn (PENDING, COMPLETED, CANCELLED, REFUNDED)
6. **ServiceType.java** - Loại dịch vụ (STICK_RENTAL, FOOD, BEVERAGE)
7. **SalaryType.java** - Loại lương (FIXED, HOURLY, COMMISSION)

---

## Package Structure

```
com.mhbilliards.billiards_management
├── entity/
│   ├── BaseEntity.java
│   ├── User.java
│   ├── Branch.java
│   ├── BranchImage.java
│   ├── Employee.java
│   ├── EmployeePosition.java
│   ├── Attendance.java
│   ├── Salary.java
│   ├── Customer.java
│   ├── TableBilliard.java
│   ├── TableBilliardType.java
│   ├── TableStatusHistory.java
│   ├── BilliardSession.java
│   ├── Service.java
│   ├── SessionService.java
│   ├── Combo.java
│   ├── ComboService.java
│   ├── SessionCombo.java
│   ├── Inventory.java
│   ├── InventoryMovement.java
│   ├── Invoice.java
│   ├── InvoiceDetail.java
│   ├── ExtraCharge.java
│   └── DiscountPolicy.java
└── enums/
    ├── UserRole.java (existing)
    ├── CustomerRank.java
    ├── TableStatus.java
    ├── SessionStatus.java
    ├── AttendanceStatus.java
    ├── InvoiceStatus.java
    ├── ServiceType.java
    └── SalaryType.java
```

---

## Key Features

### ✅ Quản lý nhân viên

- Chấm công chi tiết (PRESENT, ABSENT, LATE, EARLY_LEAVE)
- Tính lương linh hoạt (FIXED, HOURLY, COMMISSION)
- Lưu trữ thông tin ngân hàng và liên lạc khẩn cấp

### ✅ Quản lý khách hàng

- Enum rank khách hàng (BRONZE → PLATINUM)
- Tự động áp dụng discount dựa trên rank
- Theo dõi tổng tiền đã chi tiêu

### ✅ Quản lý phiên chơi & bàn billiards

- Trạng thái bàn (AVAILABLE, IN_USE, MAINTENANCE, RESERVED)
- Lịch sử chi tiết mỗi lần thay đổi trạng thái
- Quản lý phiên chơi hoàn chỉnh (start, end, duration, status)

### ✅ Quản lý dịch vụ

- Hỗ trợ 3 loại dịch vụ: Thuê gậy, Đồ ăn, Đồ uống
- Liên kết dịch vụ với phiên chơi và combo

### ✅ Quản lý combo

- Tạo combo với nhiều dịch vụ
- Liên kết combo với phiên chơi
- Theo dõi giá tại thời điểm sử dụng

### ✅ Quản lý tồn kho

- Theo dõi số lượng tồn kho
- Cảnh báo khi dưới mức tối thiểu
- Lịch sử chi tiết mỗi lần thay đổi tồn kho

### ✅ Quản lý hóa đơn

- Tạo hóa đơn tự động khi kết thúc phiên
- Áp dụng discount dựa trên rank khách hàng
- Chi tiết chi phí (giờ chơi, combo, dịch vụ)
- Theo dõi trạng thái thanh toán

### ✅ Chi phí và khuyến mãi

- Quản lý chi phí phụ thêm
- Chính sách giảm giá theo chương trình

---

## Next Steps (Các bước tiếp theo)

1. **Tạo Repository interfaces** cho mỗi entity
2. **Tạo Service classes** để xử lý logic kinh doanh
3. **Tạo DTOs (Data Transfer Objects)** cho request/response
4. **Tạo Controllers** để expose APIs
5. **Tạo Database migrations** (Flyway/Liquibase)
6. **Viết Unit tests** cho service layer
7. **Tạo API documentation** (Swagger/OpenAPI)

---

## Important Notes

- Tất cả entities đã được thiết kế với audit trail (createdAt, updatedAt, createdBy, updatedBy)
- Sử dụng lazy loading cho các relationships để tối ưu hiệu suất
- Các fields quantitative (price, amount, salary) sử dụng Double type
- Các unique constraints được áp dụng để đảm bảo data integrity
- Chi tiết mối quan hệ giữa các entities xem trong ENTITY_DOCUMENTATION.md
