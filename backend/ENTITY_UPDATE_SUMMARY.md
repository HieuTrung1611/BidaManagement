# 📝 Tóm tắt Cập nhật Entity - May 11, 2026

## ✅ Đã hoàn thành

### 1. Tạo 3 Enum mới:

- ✅ [ProductType.java](src/main/java/com/mhbilliards/billiards_management/enums/ProductType.java) - FOOD, BEVERAGE
- ✅ [EquipmentType.java](src/main/java/com/mhbilliards/billiards_management/enums/EquipmentType.java) - STICK, CHALK, GLOVES, BRIDGE, OTHER
- ✅ [ComboItemType.java](src/main/java/com/mhbilliards/billiards_management/enums/ComboItemType.java) - PRODUCT, EQUIPMENT

### 2. Tạo 5 Entity mới:

- ✅ [Product.java](src/main/java/com/mhbilliards/billiards_management/entity/Product.java) - Đồ ăn/uống (có giá nhập/bán, tồn kho)
- ✅ [Equipment.java](src/main/java/com/mhbilliards/billiards_management/entity/Equipment.java) - Thiết bị cho thuê (giá thuê/giờ)
- ✅ [ComboItem.java](src/main/java/com/mhbilliards/billiards_management/entity/ComboItem.java) - Item trong combo
- ✅ [SessionProduct.java](src/main/java/com/mhbilliards/billiards_management/entity/SessionProduct.java) - Product trong session
- ✅ [SessionEquipment.java](src/main/java/com/mhbilliards/billiards_management/entity/SessionEquipment.java) - Equipment thuê trong session

### 3. Cập nhật 2 Entity hiện có:

- ✅ [Combo.java](src/main/java/com/mhbilliards/billiards_management/entity/Combo.java)
    - Xóa: `durationHours`, `price`
    - Thêm: `regularPrice`, `discountedPrice`
    - Thay đổi: `@Builder` → `@SuperBuilder`
- ✅ [SessionCombo.java](src/main/java/com/mhbilliards/billiards_management/entity/SessionCombo.java)
    - Cập nhật comment và documentation
    - Thay đổi: `@Builder` → `@SuperBuilder`

### 4. Tạo 3 File Documentation:

- ✅ [ENTITY_REDESIGN_PROPOSAL.md](ENTITY_REDESIGN_PROPOSAL.md) - Đề xuất thiết kế chi tiết
- ✅ [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md) - Hướng dẫn migration đầy đủ
- ✅ [TABLES_TO_DELETE.md](TABLES_TO_DELETE.md) - Danh sách bảng cần xóa

## 📊 Tổng quan Thay đổi

### Bảng Database:

| Trạng thái | Tên Bảng             | Ghi chú                                 |
| ---------- | -------------------- | --------------------------------------- |
| ➕ Mới     | `products`           | Thay thế `services` (FOOD/BEVERAGE)     |
| ➕ Mới     | `equipments`         | Thay thế `services` (STICK_RENTAL)      |
| ➕ Mới     | `combo_items`        | Thay thế `combo_services`               |
| ➕ Mới     | `session_products`   | Thay thế `session_services` (products)  |
| ➕ Mới     | `session_equipments` | Thay thế `session_services` (equipment) |
| 🔄 Sửa     | `combos`             | ALTER columns                           |
| ❌ Xóa     | `services`           | Sau khi migrate                         |
| ❌ Xóa     | `session_services`   | Sau khi migrate                         |
| ❌ Xóa     | `combo_services`     | Sau khi migrate                         |

### Entity Java:

| Trạng thái | File                    | Thay đổi                                                 |
| ---------- | ----------------------- | -------------------------------------------------------- |
| ➕ Mới     | `Product.java`          | Quản lý đồ ăn/uống                                       |
| ➕ Mới     | `Equipment.java`        | Quản lý thiết bị cho thuê                                |
| ➕ Mới     | `ComboItem.java`        | Thay `ComboService.java`                                 |
| ➕ Mới     | `SessionProduct.java`   | Thay `SessionService.java` (product)                     |
| ➕ Mới     | `SessionEquipment.java` | Thay `SessionService.java` (equipment)                   |
| 🔄 Sửa     | `Combo.java`            | Xóa `durationHours`, thêm `regularPrice/discountedPrice` |
| 🔄 Sửa     | `SessionCombo.java`     | Update comments                                          |
| ❌ Xóa     | `Service.java`          | Sau khi cập nhật code                                    |
| ❌ Xóa     | `SessionService.java`   | Sau khi cập nhật code                                    |
| ❌ Xóa     | `ComboService.java`     | Sau khi cập nhật code                                    |
| ❌ Xóa     | `ServiceType.java`      | Sau khi cập nhật code                                    |

## 🔄 Các bước tiếp theo

### 1. Run application để tạo bảng mới:

```bash
cd backend
./mvnw spring-boot:run
```

JPA sẽ tự động tạo các bảng: `products`, `equipments`, `combo_items`, `session_products`, `session_equipments`

### 2. Migrate dữ liệu:

Xem chi tiết trong [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md)

### 3. Tạo Repository cho entity mới:

- [ ] `ProductRepository.java`
- [ ] `EquipmentRepository.java`
- [ ] `ComboItemRepository.java`
- [ ] `SessionProductRepository.java`
- [ ] `SessionEquipmentRepository.java`

### 4. Cập nhật Service Layer:

- [ ] Tạo `ProductService.java`
- [ ] Tạo `EquipmentService.java`
- [ ] Cập nhật `ComboService.java` để sử dụng `ComboItem`
- [ ] Cập nhật `BilliardSessionService.java` để tính tiền mới

### 5. Cập nhật Controller Layer:

- [ ] Tạo `ProductController.java`
- [ ] Tạo `EquipmentController.java`
- [ ] Cập nhật `ComboController.java`
- [ ] Cập nhật `BilliardSessionController.java`

### 6. Xóa code cũ (SAU KHI test xong):

- [ ] Xóa `ServiceRepository.java`
- [ ] Xóa `SessionServiceRepository.java`
- [ ] Xóa `ComboServiceRepository.java`
- [ ] Xóa các Service/Controller liên quan

### 7. Xóa bảng database cũ:

Xem script trong [TABLES_TO_DELETE.md](TABLES_TO_DELETE.md)

## 🎯 Lợi ích của thiết kế mới

1. **Tách biệt rõ ràng**: Product (bán) vs Equipment (thuê)
2. **Quản lý tồn kho tốt hơn**: Product có `stockQuantity`, Equipment có `availableQuantity`
3. **Logic tính tiền chính xác**: Mỗi loại có cách tính phù hợp
4. **Linh hoạt**: Khách có thể dùng combo + gọi thêm đồ lẻ
5. **Dễ mở rộng**: Thêm loại equipment mới dễ dàng

## 📞 Hỗ trợ

Nếu có vấn đề, xem chi tiết trong:

- [ENTITY_REDESIGN_PROPOSAL.md](ENTITY_REDESIGN_PROPOSAL.md) - Thiết kế và lý do
- [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md) - Hướng dẫn migration
- [TABLES_TO_DELETE.md](TABLES_TO_DELETE.md) - Danh sách bảng xóa
