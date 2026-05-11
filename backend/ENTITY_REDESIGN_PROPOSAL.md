# Đề xuất thiết kế lại Entity cho hệ thống Billiard

## 🎯 Mục tiêu

Tách biệt rõ ràng các loại dịch vụ khác nhau và làm rõ mục đích của Combo

## 📋 Thiết kế mới

### 1. Product (Đồ ăn/uống - có tồn kho)

```java
@Entity
@Table(name = "products")
public class Product extends BaseEntity {
    @Column(nullable = false)
    String name;

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProductType type; // FOOD, BEVERAGE

    @Column(nullable = false)
    Double purchasePrice; // Giá nhập

    @Column(nullable = false)
    Double salePrice; // Giá bán

    @Column(nullable = false)
    Integer stockQuantity; // Số lượng tồn kho

    String unit; // Đơn vị: chai, ly, phần, ...

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
```

### 2. Equipment (Thiết bị cho thuê - không có tồn kho phức tạp)

```java
@Entity
@Table(name = "equipments")
public class Equipment extends BaseEntity {
    @Column(nullable = false)
    String name; // VD: Gậy loại A, Gậy VIP, Phấn

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    EquipmentType type; // STICK, CHALK, GLOVES, ...

    @Column(nullable = false)
    Double rentalPricePerHour; // Giá thuê/giờ

    @Column(nullable = false)
    Integer totalQuantity; // Tổng số lượng thiết bị có

    @Column(nullable = false)
    Integer availableQuantity; // Số lượng đang available (không đang thuê)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
```

### 3. Combo - 2 Options:

#### **Option A: Combo chỉ bao gồm Products/Equipment (Đề xuất)**

Combo = gói ưu đãi các sản phẩm/thiết bị, KHÔNG bao gồm giờ chơi

```java
@Entity
@Table(name = "combos")
public class Combo extends BaseEntity {
    @Column(nullable = false)
    String name; // VD: "Combo Happy Hour", "Combo Sinh viên"

    String description;

    @Column(nullable = false)
    Double regularPrice; // Tổng giá thường (nếu mua lẻ)

    @Column(nullable = false)
    Double discountedPrice; // Giá ưu đãi combo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
```

**ComboItem** (thay thế ComboService):

```java
@Entity
@Table(name = "combo_items")
public class ComboItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    Combo combo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ComboItemType itemType; // PRODUCT, EQUIPMENT

    @Column(nullable = false)
    Long itemId; // ID của Product hoặc Equipment

    @Column(nullable = false)
    Integer quantity;
}
```

#### **Option B: Combo bao gồm cả giờ chơi**

Nếu bạn muốn Combo có thể bao gồm giờ chơi (VD: "2h + 2 nước + 1 gậy")

```java
@Entity
@Table(name = "combos")
public class Combo extends BaseEntity {
    @Column(nullable = false)
    String name;

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ComboType type; // TIME_ONLY, ITEMS_ONLY, TIME_WITH_ITEMS

    // Chỉ dùng khi type = TIME_ONLY hoặc TIME_WITH_ITEMS
    Double includedHours; // Số giờ chơi trong combo (nullable)

    @Column(nullable = false)
    Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
```

### 4. SessionProduct (thay SessionService cho Product)

```java
@Entity
@Table(name = "session_products")
public class SessionProduct extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    BilliardSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @Column(nullable = false)
    Integer quantity;

    @Column(nullable = false)
    Double unitPrice; // Giá tại thời điểm đặt

    @Column(nullable = false)
    Double totalAmount; // quantity * unitPrice
}
```

### 5. SessionEquipment (thay SessionService cho Equipment)

```java
@Entity
@Table(name = "session_equipments")
public class SessionEquipment extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    BilliardSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    Equipment equipment;

    @Column(nullable = false)
    Integer quantity; // Số lượng thuê

    @Column(nullable = false)
    LocalDateTime startTime; // Thời điểm bắt đầu thuê

    LocalDateTime endTime; // Thời điểm trả (nullable nếu chưa trả)

    @Column(nullable = false)
    Double hourlyRate; // Giá thuê/giờ tại thời điểm thuê

    Double totalAmount; // Tính khi trả: (endTime - startTime) * hourlyRate
}
```

## 📊 Luồng tính tiền mới

### Công thức chung (đáp ứng mọi trường hợp):

```
Total = Table rental + Combos + Extra Products + Extra Equipment
```

### Khi khách KHÔNG dùng Combo:

```
Total = Table rental + Products + Equipment rental
```

Ví dụ:

- Giờ chơi: 3h × 50k = 150k
- Đồ uống: 2 ly × 20k = 40k
- Thuê gậy: 3h × 10k = 30k
- **Tổng: 220k**

### Khi khách dùng Combo (Option A - không bao gồm giờ):

```
Total = Table rental + Combo price
```

Ví dụ:

- Giờ chơi: 3h × 50k = 150k
- Combo "2 nước + 1 gậy": 45k (thay vì 40k + 30k = 70k)
- **Tổng: 195k** (tiết kiệm 25k)

### ⭐ Khi khách dùng Combo + Gọi thêm (QUAN TRỌNG):

```
Total = Table rental + Combo price + Extra items
```

Ví dụ:

- Giờ chơi: 3h × 100k = 300k
- Combo "2 nước + 1 gậy": 45k
- Gọi thêm 1 nước: 20k
- Thuê thêm 1 gậy (2h): 2 × 10k = 20k
- **Tổng: 385k** (vẫn tiết kiệm so với toàn bộ mua lẻ)

**Database structure cho case này:**

```
BilliardSession (id: 1)
├── SessionCombo (combo_id: 10, quantity: 1, total: 45k)
├── SessionProduct (product_id: 5, quantity: 1, total: 20k)  ← Gọi thêm
└── SessionEquipment (equipment_id: 3, quantity: 1, total: 20k) ← Thuê thêm
```

### Khi khách dùng Combo (Option B - bao gồm giờ):

```
Total = Combo price (all included) + Extra items
```

Ví dụ:

- Combo "2h + 2 nước + 1 gậy": 150k (thay vì 220k)
- Chơi thêm 1h: 50k
- **Tổng: 200k** (tiết kiệm 20k)

## 🔄 Migration Strategy

### Entity Relationships (Mối quan hệ trong thiết kế mới)

```
BilliardSession (1 session)
    ├─── SessionCombos (0..n) ────> Combo ────> ComboItems ──┬──> Product
    │                                                          └──> Equipment
    ├─── SessionProducts (0..n) ──> Product
    └─── SessionEquipments (0..n) ─> Equipment

Giải thích:
- Một session có thể có nhiều combo (SessionCombos)
- Một session có thể có nhiều product riêng lẻ (SessionProducts) - bao gồm cả gọi thêm
- Một session có thể có nhiều equipment riêng lẻ (SessionEquipments) - bao gồm cả thuê thêm
- Combo được định nghĩa bởi ComboItems (chứa các Product/Equipment)
```

### Ví dụ code tính tổng tiền:

```java
public class BilliardSessionService {

    public Double calculateSessionTotal(BilliardSession session) {
        // 1. Tiền giờ chơi bàn
        TableBilliard table = session.getTable();
        double tableRentalCost = session.getDurationHours() * table.getHourlyRate();

        // 2. Tiền combo (nếu có)
        double comboCost = session.getSessionCombos()
            .stream()
            .mapToDouble(SessionCombo::getTotalAmount)
            .sum();

        // 3. Tiền đồ ăn/uống gọi thêm (nếu có)
        double extraProductsCost = session.getSessionProducts()
            .stream()
            .mapToDouble(SessionProduct::getTotalAmount)
            .sum();

        // 4. Tiền thiết bị thuê thêm (nếu có)
        double extraEquipmentCost = session.getSessionEquipments()
            .stream()
            .mapToDouble(SessionEquipment::getTotalAmount)
            .sum();

        // TỔNG = Bàn + Combo + Gọi thêm + Thuê thêm
        return tableRentalCost + comboCost + extraProductsCost + extraEquipmentCost;
    }

    // Ví dụ report: Combo nào bán chạy nhất
    public List<ComboSalesReport> getMostPopularCombos(Long branchId, LocalDate fromDate, LocalDate toDate) {
        return sessionComboRepository.findMostPopularCombos(branchId, fromDate, toDate);
    }

    // Ví dụ report: Món gọi thêm phổ biến nhất (ngoài combo)
    public List<ProductSalesReport> getMostOrderedExtraProducts(Long branchId, LocalDate fromDate, LocalDate toDate) {
        return sessionProductRepository.findMostOrdered(branchId, fromDate, toDate);
    }
}
```

### Bước 1: Tạo các entity mới

- Product
- Equipment
- ComboItem (thay ComboService)
- SessionProduct
- SessionEquipment

### Bước 2: Migration dữ liệu cũ

```sql
-- Chuyển Service type FOOD/BEVERAGE sang Product
INSERT INTO products (...)
SELECT ... FROM services WHERE type IN ('FOOD', 'BEVERAGE');

-- Chuyển Service type STICK_RENTAL sang Equipment
INSERT INTO equipments (...)
SELECT ... FROM services WHERE type = 'STICK_RENTAL';

-- Chuyển SessionService sang SessionProduct/SessionEquipment
-- Tương tự cho các entity khác
```

### Bước 3: Xóa các entity cũ

- Service
- ServiceType enum
- SessionService
- ComboService

## 💡 Khuyến nghị

### **Nên chọn Option nào?**

**Option A (Combo không bao gồm giờ)** - Đề xuất cho hầu hết trường hợp:

- ✅ Đơn giản, dễ hiểu
- ✅ Phù hợp với mô hình "bán" combo đồ ăn/uống
- ✅ Giờ chơi vẫn tính theo thực tế
- ✅ Linh hoạt hơn (khách có thể mua combo + chơi bao lâu tùy thích)

**Option B (Combo bao gồm giờ)** - Chỉ khi:

- Bạn muốn bán "gói trọn gói" (all-inclusive package)
- VD: "Gói 2h chơi + ăn uống" với giá cố định
- Phù hợp với booking trước, không tính theo giờ thực tế

## 🎯 Kết luận

Thiết kế mới:

1. **Tách biệt rõ ràng**: Product (bán) vs Equipment (thuê) vs Combo (gói ưu đãi)
2. **Dễ quản lý tồn kho**: Product có stockQuantity, Equipment có availableQuantity
3. **Logic tính tiền rõ ràng**: Mỗi loại có cách tính riêng phù hợp
4. **Combo linh hoạt**: Có thể chọn Option A hoặc B tùy business model
5. **✅ ĐÁP ỨNG ĐẦY ĐỦ**: Khách có thể dùng combo + gọi thêm đồ lẻ

## 🎬 Use Cases được hỗ trợ

| Trường hợp                            | SessionCombo | SessionProduct | SessionEquipment | Ghi chú                              |
| ------------------------------------- | ------------ | -------------- | ---------------- | ------------------------------------ |
| Chơi bàn, không gọi gì                | ❌           | ❌             | ❌               | Chỉ tính tiền bàn                    |
| Chơi + gọi đồ lẻ                      | ❌           | ✅             | ✅               | Không dùng combo                     |
| Chơi + mua 1 combo                    | ✅           | ❌             | ❌               | Chỉ dùng combo                       |
| Chơi + mua nhiều combo                | ✅ (nhiều)   | ❌             | ❌               | VD: 2 combo khác nhau                |
| **Chơi + combo + gọi thêm**           | ✅           | ✅             | ✅               | **⭐ Case quan trọng**               |
| Combo + gọi thêm đồ giống trong combo | ✅           | ✅             | ❌               | VD: Combo có 2 nước, gọi thêm 1 nước |

### Ví dụ chi tiết Case cuối cùng:

**Tình huống:** Nhóm 4 người chơi, mua 1 combo nhưng không đủ nên gọi thêm

```
Session Start: 14:00
Session End: 17:00 (3 giờ)
Bàn: VIP (100k/giờ)

Orders:
├─ 14:00: Mua Combo "Happy Hour" (2 nước + 1 gậy) - 45k
├─ 15:00: Gọi thêm 2 nước nữa (vì 4 người) - 2 × 20k = 40k
└─ 15:00: Thuê thêm 1 gậy nữa - 2h × 10k = 20k

Lưu database:
├─ SessionCombo: combo_id=1, quantity=1, total=45k
├─ SessionProduct: product_id=5 (nước), quantity=2, total=40k
└─ SessionEquipment: equipment_id=1 (gậy), start=15:00, end=17:00, total=20k

Tổng tiền = 300k (bàn) + 45k (combo) + 40k (nước thêm) + 20k (gậy thêm) = 405k
```

---

**Câu hỏi cần trả lời:**

1. Bạn muốn Combo bao gồm giờ chơi không? (Option A hay B)
2. Có loại thiết bị nào khác ngoài gậy cần cho thuê không?
3. Có cần quản lý việc thiết bị bị hư/mất không?
4. **Bạn có muốn tôi implement thiết kế mới ngay không?** ✨
