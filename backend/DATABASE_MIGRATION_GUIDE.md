# Database Migration Guide - Entity Redesign

## 📅 Migration Date: May 11, 2026

## 🎯 Mục tiêu Migration

Tách biệt rõ ràng các loại dịch vụ:

- **Product** (đồ ăn/uống - có giá nhập/bán, tồn kho)
- **Equipment** (thiết bị cho thuê - giá thuê/giờ, không có giá nhập/bán)
- **Combo** (gói ưu đãi, KHÔNG bao gồm giờ chơi)

## ⚠️ QUAN TRỌNG: Các bảng CẦN XÓA sau khi migration

### 1. Bảng cần xóa hoàn toàn:

```sql
-- Xóa dữ liệu và bảng cũ (sau khi đã migrate dữ liệu)
DROP TABLE IF EXISTS combo_services;    -- Thay thế bằng combo_items
DROP TABLE IF EXISTS session_services;  -- Thay thế bằng session_products + session_equipments
DROP TABLE IF EXISTS services;          -- Thay thế bằng products + equipments
```

### 2. Bảng cần ALTER (thay đổi cấu trúc):

```sql
-- Bảng combos: Thay đổi cấu trúc
ALTER TABLE combos
  DROP COLUMN duration_hours,    -- Không còn dùng
  DROP COLUMN price,              -- Thay bằng regular_price và discounted_price
  ADD COLUMN regular_price DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN discounted_price DOUBLE NOT NULL DEFAULT 0;
```

## 📋 Các Entity mới được tạo

### Entity đã tạo:

1. ✅ **Product** → Bảng: `products`
2. ✅ **Equipment** → Bảng: `equipments`
3. ✅ **ComboItem** → Bảng: `combo_items` (thay `combo_services`)
4. ✅ **SessionProduct** → Bảng: `session_products` (thay `session_services` cho products)
5. ✅ **SessionEquipment** → Bảng: `session_equipments` (thay `session_services` cho equipment)

### Enum đã tạo:

1. ✅ **ProductType**: FOOD, BEVERAGE
2. ✅ **EquipmentType**: STICK, CHALK, GLOVES, BRIDGE, OTHER
3. ✅ **ComboItemType**: PRODUCT, EQUIPMENT

### Entity đã cập nhật:

1. ✅ **Combo**: Xóa `durationHours` và `price`, thêm `regularPrice` và `discountedPrice`
2. ✅ **SessionCombo**: Cập nhật comment để rõ ràng hơn

## 🔄 Quy trình Migration chi tiết

### Bước 1: Backup Database

```sql
-- Backup toàn bộ database trước khi migration
mysqldump -u [username] -p [database_name] > backup_before_migration_$(date +%Y%m%d).sql
```

### Bước 2: Chạy ứng dụng để tạo bảng mới

```bash
# JPA sẽ tự động tạo các bảng mới:
# - products
# - equipments
# - combo_items
# - session_products
# - session_equipments

# Start backend để JPA tạo bảng
cd backend
./mvnw spring-boot:run

# Hoặc nếu đã build
java -jar target/*.jar
```

### Bước 3: Migrate dữ liệu từ bảng cũ sang bảng mới

```sql
-- 3.1. Migrate Service → Product (cho FOOD và BEVERAGE)
INSERT INTO products (
    name, description, type,
    purchase_price, sale_price, stock_quantity, unit,
    branch_id, is_active,
    created_at, updated_at, created_by, updated_by
)
SELECT
    name,
    description,
    type,  -- FOOD hoặc BEVERAGE
    price_cost as purchase_price,
    price_sale as sale_price,
    100 as stock_quantity,  -- Giá trị mặc định, cần cập nhật thủ công
    'phần' as unit,         -- Giá trị mặc định, cần cập nhật thủ công
    branch_id,
    is_active,
    created_at, updated_at, created_by, updated_by
FROM services
WHERE type IN ('FOOD', 'BEVERAGE');

-- 3.2. Migrate Service → Equipment (cho STICK_RENTAL)
INSERT INTO equipments (
    name, description, type,
    rental_price_per_hour, total_quantity, available_quantity,
    branch_id, is_active,
    created_at, updated_at, created_by, updated_by
)
SELECT
    name,
    description,
    'STICK' as type,
    price_sale as rental_price_per_hour,  -- Giá thuê/giờ
    10 as total_quantity,                  -- Giá trị mặc định
    10 as available_quantity,              -- Giá trị mặc định
    branch_id,
    is_active,
    created_at, updated_at, created_by, updated_by
FROM services
WHERE type = 'STICK_RENTAL';

-- 3.3. Migrate ComboService → ComboItem
-- Tạo mapping table tạm để map old service_id với new product_id/equipment_id
CREATE TEMPORARY TABLE service_mapping (
    old_service_id BIGINT,
    new_item_id BIGINT,
    item_type VARCHAR(20)
);

-- Map services sang products
INSERT INTO service_mapping (old_service_id, new_item_id, item_type)
SELECT s.id, p.id, 'PRODUCT'
FROM services s
JOIN products p ON s.name = p.name AND s.branch_id = p.branch_id
WHERE s.type IN ('FOOD', 'BEVERAGE');

-- Map services sang equipments
INSERT INTO service_mapping (old_service_id, new_item_id, item_type)
SELECT s.id, e.id, 'EQUIPMENT'
FROM services s
JOIN equipments e ON s.name = e.name AND s.branch_id = e.branch_id
WHERE s.type = 'STICK_RENTAL';

-- Migrate combo_services sang combo_items
INSERT INTO combo_items (
    combo_id, item_type, item_id, quantity,
    created_at, updated_at, created_by, updated_by
)
SELECT
    cs.combo_id,
    sm.item_type,
    sm.new_item_id,
    cs.quantity,
    cs.created_at, cs.updated_at, cs.created_by, cs.updated_by
FROM combo_services cs
JOIN service_mapping sm ON cs.service_id = sm.old_service_id;

-- 3.4. Migrate SessionService → SessionProduct + SessionEquipment
-- SessionProduct (cho products)
INSERT INTO session_products (
    session_id, product_id, quantity, unit_price, total_amount,
    created_at, updated_at, created_by, updated_by
)
SELECT
    ss.session_id,
    sm.new_item_id,
    ss.quantity,
    ss.price,
    ss.total_amount,
    ss.created_at, ss.updated_at, ss.created_by, ss.updated_by
FROM session_services ss
JOIN service_mapping sm ON ss.service_id = sm.old_service_id
WHERE sm.item_type = 'PRODUCT';

-- SessionEquipment (cho equipment)
INSERT INTO session_equipments (
    session_id, equipment_id, quantity,
    start_time, end_time, hourly_rate, total_amount,
    created_at, updated_at, created_by, updated_by
)
SELECT
    ss.session_id,
    sm.new_item_id,
    ss.quantity,
    bs.start_time,  -- Giả định equipment thuê cùng lúc với session
    bs.end_time,
    ss.price / NULLIF(TIMESTAMPDIFF(HOUR, bs.start_time, bs.end_time), 0) as hourly_rate,
    ss.total_amount,
    ss.created_at, ss.updated_at, ss.created_by, ss.updated_by
FROM session_services ss
JOIN service_mapping sm ON ss.service_id = sm.old_service_id
JOIN billiard_sessions bs ON ss.session_id = bs.id
WHERE sm.item_type = 'EQUIPMENT';

-- Clean up temporary table
DROP TEMPORARY TABLE service_mapping;

-- 3.5. Update Combo table structure
-- Backup combo data trước
CREATE TEMPORARY TABLE combo_backup AS SELECT * FROM combos;

-- Update combo structure (nếu có dữ liệu)
ALTER TABLE combos
  DROP COLUMN IF EXISTS duration_hours,
  CHANGE COLUMN price regular_price DOUBLE NOT NULL;

-- Add new column
ALTER TABLE combos
  ADD COLUMN discounted_price DOUBLE NOT NULL DEFAULT 0;

-- Set discounted_price = regular_price * 0.9 (ví dụ giảm 10%)
UPDATE combos
SET discounted_price = regular_price * 0.9
WHERE discounted_price = 0;
```

### Bước 4: Verify dữ liệu sau migration

```sql
-- Kiểm tra số lượng records
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'equipments', COUNT(*) FROM equipments
UNION ALL
SELECT 'combo_services', COUNT(*) FROM combo_services
UNION ALL
SELECT 'combo_items', COUNT(*) FROM combo_items
UNION ALL
SELECT 'session_services', COUNT(*) FROM session_services
UNION ALL
SELECT 'session_products', COUNT(*) FROM session_products
UNION ALL
SELECT 'session_equipments', COUNT(*) FROM session_equipments;

-- Kiểm tra combo structure
DESCRIBE combos;
SELECT * FROM combos LIMIT 5;
```

### Bước 5: Xóa bảng cũ (SAU KHI VERIFY)

```sql
-- ⚠️ CHỈ XÓA SAU KHI ĐÃ VERIFY DỮ LIỆU ĐÚNG!

-- Drop foreign key constraints trước
ALTER TABLE session_services DROP FOREIGN KEY IF EXISTS fk_session_services_service;
ALTER TABLE session_services DROP FOREIGN KEY IF EXISTS fk_session_services_session;
ALTER TABLE combo_services DROP FOREIGN KEY IF EXISTS fk_combo_services_service;
ALTER TABLE combo_services DROP FOREIGN KEY IF EXISTS fk_combo_services_combo;

-- Xóa bảng
DROP TABLE IF EXISTS session_services;
DROP TABLE IF EXISTS combo_services;
DROP TABLE IF EXISTS services;
```

## 📊 So sánh trước và sau migration

| Trước Migration             | Sau Migration                                      | Ghi chú                        |
| --------------------------- | -------------------------------------------------- | ------------------------------ |
| `services` (1 bảng)         | `products` + `equipments` (2 bảng)                 | Tách biệt rõ ràng              |
| `session_services` (1 bảng) | `session_products` + `session_equipments` (2 bảng) | Tách riêng đồ ăn/thuê thiết bị |
| `combo_services` (1 bảng)   | `combo_items` (1 bảng)                             | Rename + thêm itemType         |
| `combos.duration_hours`     | Xóa                                                | Giờ chơi tính từ session       |
| `combos.price`              | `regular_price` + `discounted_price`               | Rõ ràng hơn về giá             |

## 🗑️ Danh sách các file code cần xóa (SAU KHI HOÀN TẤT)

### Entity cần xóa:

```
❌ Service.java
❌ ServiceType.java (enum)
❌ SessionService.java
❌ ComboService.java
```

### Repository cần xóa/cập nhật:

- Xóa: `ServiceRepository.java`, `SessionServiceRepository.java`, `ComboServiceRepository.java`
- Tạo mới: `ProductRepository.java`, `EquipmentRepository.java`, `ComboItemRepository.java`, `SessionProductRepository.java`, `SessionEquipmentRepository.java`

### Service/Controller cần cập nhật:

- Tất cả các service/controller sử dụng `Service`, `SessionService`, `ComboService` entity
- Cập nhật logic business để sử dụng entity mới

## ✅ Checklist hoàn thành Migration

- [ ] Backup database
- [ ] Chạy app để tạo bảng mới
- [ ] Migrate dữ liệu từ bảng cũ
- [ ] Verify dữ liệu đã migrate đúng
- [ ] Test ứng dụng với entity mới
- [ ] Xóa foreign key constraints
- [ ] Xóa các bảng cũ: `services`, `session_services`, `combo_services`
- [ ] Xóa các file entity cũ trong code
- [ ] Tạo/cập nhật repository mới
- [ ] Cập nhật service/controller layer
- [ ] Test toàn bộ flow: tạo session, gọi đồ, dùng combo, tính tiền
- [ ] Cập nhật documentation/API docs
- [ ] Deploy lên production

## 🚨 Lưu ý quan trọng

1. **Không xóa bảng cũ ngay lập tức**: Giữ lại ít nhất 1-2 tuần để đảm bảo dữ liệu migrate đúng
2. **Backup trước khi xóa**: Luôn có backup trước khi xóa bất kỳ bảng nào
3. **Migrate từng bước**: Không migrate tất cả cùng lúc, test từng bước
4. **Kiểm tra foreign keys**: Đảm bảo không còn foreign key nào tham chiếu đến bảng cũ
5. **Update application code**: Cập nhật tất cả code sử dụng entity cũ trước khi xóa bảng

## 📞 Support

Nếu có vấn đề trong quá trình migration, rollback bằng cách:

```sql
-- Restore từ backup
mysql -u [username] -p [database_name] < backup_before_migration_YYYYMMDD.sql
```
