# 🗑️ Danh sách Bảng cần XÓA trong Database

## ⚠️ QUAN TRỌNG: Chỉ xóa SAU KHI đã migrate và verify dữ liệu!

### 3 Bảng cần XÓA hoàn toàn:

```sql
-- 1. Bảng combo_services → Thay thế bằng combo_items
DROP TABLE IF EXISTS combo_services;

-- 2. Bảng session_services → Thay thế bằng session_products + session_equipments
DROP TABLE IF EXISTS session_services;

-- 3. Bảng services → Thay thế bằng products + equipments
DROP TABLE IF EXISTS services;
```

### 1 Bảng cần ALTER (thay đổi cấu trúc):

```sql
-- Bảng combos: Xóa 2 cột cũ, thêm 2 cột mới
ALTER TABLE combos
  DROP COLUMN duration_hours,     -- Xóa (không còn dùng)
  DROP COLUMN price,               -- Xóa (thay bằng 2 cột mới)
  ADD COLUMN regular_price DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN discounted_price DOUBLE NOT NULL DEFAULT 0;
```

## 📋 Mapping Bảng Cũ → Bảng Mới

| Bảng Cũ (XÓA)                      | Bảng Mới (GIỮ LẠI)   | Ghi chú                        |
| ---------------------------------- | -------------------- | ------------------------------ |
| `services` (type: FOOD/BEVERAGE)   | `products`           | Có giá nhập/bán, tồn kho       |
| `services` (type: STICK_RENTAL)    | `equipments`         | Có giá thuê/giờ                |
| `session_services` (với Product)   | `session_products`   | Đồ ăn/uống trong session       |
| `session_services` (với Equipment) | `session_equipments` | Thiết bị thuê trong session    |
| `combo_services`                   | `combo_items`        | Item trong combo (có itemType) |
| `combos` (cũ)                      | `combos` (mới)       | ALTER structure                |

## 📝 Các Entity Java đã XÓA/THAY THẾ:

### ❌ Entity cũ (cần xóa file):

- `Service.java` → Thay bằng `Product.java` + `Equipment.java`
- `SessionService.java` → Thay bằng `SessionProduct.java` + `SessionEquipment.java`
- `ComboService.java` → Thay bằng `ComboItem.java`
- `ServiceType.java` (enum) → Thay bằng `ProductType.java` + `EquipmentType.java`

### ✅ Entity mới (đã tạo):

- `Product.java` ✓
- `Equipment.java` ✓
- `ComboItem.java` ✓
- `SessionProduct.java` ✓
- `SessionEquipment.java` ✓
- `ProductType.java` (enum) ✓
- `EquipmentType.java` (enum) ✓
- `ComboItemType.java` (enum) ✓

### 🔄 Entity đã cập nhật:

- `Combo.java` - Xóa `durationHours` và `price`, thêm `regularPrice` và `discountedPrice` ✓
- `SessionCombo.java` - Cập nhật comment ✓

## 🚀 Quy trình Xóa Bảng

### Bước 1: Xóa Foreign Key Constraints trước

```sql
-- Xóa constraints của session_services
ALTER TABLE session_services
  DROP FOREIGN KEY IF EXISTS fk_session_services_service,
  DROP FOREIGN KEY IF EXISTS fk_session_services_session;

-- Xóa constraints của combo_services
ALTER TABLE combo_services
  DROP FOREIGN KEY IF EXISTS fk_combo_services_service,
  DROP FOREIGN KEY IF EXISTS fk_combo_services_combo;
```

### Bước 2: Xóa các bảng

```sql
DROP TABLE IF EXISTS session_services;
DROP TABLE IF EXISTS combo_services;
DROP TABLE IF EXISTS services;
```

### Bước 3: Verify (kiểm tra bảng đã bị xóa)

```sql
SHOW TABLES LIKE '%service%';
-- Không nên thấy: services, session_services, combo_services
-- Chỉ thấy các bảng mới: products, equipments, session_products, session_equipments, combo_items
```

## ⚡ Script Xóa Nhanh (Sau khi đã migrate)

```sql
-- Copy và chạy script này SAU KHI đã verify dữ liệu migrate đúng

-- Drop constraints
ALTER TABLE session_services DROP FOREIGN KEY IF EXISTS fk_session_services_service;
ALTER TABLE session_services DROP FOREIGN KEY IF EXISTS fk_session_services_session;
ALTER TABLE combo_services DROP FOREIGN KEY IF EXISTS fk_combo_services_service;
ALTER TABLE combo_services DROP FOREIGN KEY IF EXISTS fk_combo_services_combo;

-- Drop tables
DROP TABLE IF EXISTS session_services;
DROP TABLE IF EXISTS combo_services;
DROP TABLE IF EXISTS services;

-- Verify
SHOW TABLES;
```

## ✅ Checklist Trước Khi Xóa

- [ ] Đã backup database
- [ ] Đã migrate dữ liệu sang bảng mới
- [ ] Đã verify dữ liệu migrate đúng (count, sample data)
- [ ] Đã test application với entity mới
- [ ] Đã cập nhật tất cả repository/service/controller
- [ ] Application chạy OK với entity mới
- [ ] Không còn code nào reference đến entity cũ

**CHỈ XÓA BẢNG SAU KHI TẤT CẢ CHECKLIST TRÊN HOÀN THÀNH!**

---

📖 **Xem chi tiết migration tại:** [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md)
