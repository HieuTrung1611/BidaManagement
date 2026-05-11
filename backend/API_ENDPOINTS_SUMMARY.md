# API Endpoints Summary - Product, Equipment, ComboItem, SessionProduct, SessionEquipment & Invoice

## Product APIs (`/products`)

### 1. Create Product

**POST** `/products`

- **Auth**: ADMIN, MANAGER
- **Body**: `CreateProductDTO`

```json
{
    "name": "Coca Cola",
    "description": "Nước ngọt có ga",
    "type": "BEVERAGE",
    "purchasePrice": 8000,
    "salePrice": 15000,
    "stockQuantity": 100,
    "unit": "chai",
    "branchId": 1,
    "isActive": true
}
```

### 2. Get Product by ID

**GET** `/products/{id}`

- **Auth**: ADMIN, MANAGER, STAFF

### 3. Search Products

**GET** `/products?keyword=coca&type=BEVERAGE&branchId=1&page=0&size=10&sortBy=id&sortDirection=DESC`

- **Auth**: ADMIN, MANAGER, STAFF

### 4. Get Products by Branch

**GET** `/products/branch/{branchId}`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: Active products only

### 5. Get Low Stock Products

**GET** `/products/branch/{branchId}/low-stock`

- **Auth**: ADMIN, MANAGER
- **Returns**: Products with stockQuantity < 10

### 6. Update Product

**PUT** `/products/{id}`

- **Auth**: ADMIN, MANAGER
- **Body**: `UpdateProductDTO`

### 7. Update Stock Quantity

**PUT** `/products/{id}/stock?quantity=10&isAddition=true`

- **Auth**: ADMIN, MANAGER
- **isAddition**: true = nhập thêm, false = xuất kho

### 8. Delete Product

**DELETE** `/products/{id}`

- **Auth**: ADMIN

---

## Equipment APIs (`/equipments`)

### 1. Create Equipment

**POST** `/equipments`

- **Auth**: ADMIN, MANAGER
- **Body**: `CreateEquipmentDTO`

```json
{
    "name": "Cơ gỗ cao cấp",
    "description": "Cơ bi-a chuyên nghiệp",
    "type": "STICK",
    "rentalPricePerHour": 10000,
    "totalQuantity": 20,
    "availableQuantity": 20,
    "branchId": 1,
    "isActive": true
}
```

### 2. Get Equipment by ID

**GET** `/equipments/{id}`

- **Auth**: ADMIN, MANAGER, STAFF

### 3. Search Equipments

**GET** `/equipments?keyword=cơ&type=STICK&branchId=1&page=0&size=10`

- **Auth**: ADMIN, MANAGER, STAFF

### 4. Get Equipments by Branch

**GET** `/equipments/branch/{branchId}`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: Active equipments only

### 5. Get Available Equipments

**GET** `/equipments/branch/{branchId}/available`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: Equipments with availableQuantity > 0

### 6. Update Equipment

**PUT** `/equipments/{id}`

- **Auth**: ADMIN, MANAGER

### 7. Delete Equipment

**DELETE** `/equipments/{id}`

- **Auth**: ADMIN

---

## ComboItem APIs (`/combo-items`)

### 1. Add Item to Combo

**POST** `/combo-items`

- **Auth**: ADMIN, MANAGER
- **Body**: `CreateComboItemDTO`

```json
{
    "comboId": 1,
    "itemType": "PRODUCT",
    "itemId": 5,
    "quantity": 2
}
```

### 2. Get ComboItem by ID

**GET** `/combo-items/{id}`

- **Auth**: ADMIN, MANAGER, STAFF

### 3. Get ComboItems by Combo

**GET** `/combo-items/combo/{comboId}`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: All items in a combo

### 4. Update ComboItem

**PUT** `/combo-items/{id}`

- **Auth**: ADMIN, MANAGER

### 5. Delete ComboItem

**DELETE** `/combo-items/{id}`

- **Auth**: ADMIN, MANAGER

### 6. Delete All Items in Combo

**DELETE** `/combo-items/combo/{comboId}`

- **Auth**: ADMIN, MANAGER

---

## SessionProduct APIs (`/session-products`)

### 1. Add Product to Session

**POST** `/session-products`

- **Auth**: ADMIN, MANAGER, STAFF
- **Body**: `CreateSessionProductDTO`

```json
{
    "sessionId": 10,
    "productId": 5,
    "quantity": 3
}
```

- **Logic**: Tự động trừ stockQuantity, tính totalAmount

### 2. Get SessionProduct by ID

**GET** `/session-products/{id}`

- **Auth**: ADMIN, MANAGER, STAFF

### 3. Get Products by Session

**GET** `/session-products/session/{sessionId}`

- **Auth**: ADMIN, MANAGER, STAFF

### 4. Delete SessionProduct

**DELETE** `/session-products/{id}`

- **Auth**: ADMIN, MANAGER
- **Logic**: Trả lại số lượng vào stock

---

## SessionEquipment APIs (`/session-equipments`)

### 1. Rent Equipment for Session

**POST** `/session-equipments`

- **Auth**: ADMIN, MANAGER, STAFF
- **Body**: `CreateSessionEquipmentDTO`

```json
{
    "sessionId": 10,
    "equipmentId": 3,
    "quantity": 1
}
```

- **Logic**: Trừ availableQuantity, ghi startTime

### 2. Return Equipment

**PUT** `/session-equipments/{id}/return`

- **Auth**: ADMIN, MANAGER, STAFF
- **Logic**: Ghi endTime, tính totalAmount, cộng lại availableQuantity

### 3. Get SessionEquipment by ID

**GET** `/session-equipments/{id}`

- **Auth**: ADMIN, MANAGER, STAFF

### 4. Get Equipments by Session

**GET** `/session-equipments/session/{sessionId}`

- **Auth**: ADMIN, MANAGER, STAFF

### 5. Get Active Rentals by Session

**GET** `/session-equipments/session/{sessionId}/active`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: Equipment chưa trả (endTime IS NULL)

### 6. Delete SessionEquipment

**DELETE** `/session-equipments/{id}`

- **Auth**: ADMIN, MANAGER
- **Logic**: Nếu chưa trả, trả lại availableQuantity

---

## Table Status API (Added to `/table-billiard`)

### Update Table Status

**PATCH** `/table-billiard/{id}/status?status=AVAILABLE`

- **Auth**: ADMIN, MANAGER, STAFF
- **Status Values**: AVAILABLE, IN_USE, MAINTENANCE, RESERVED
- **Response**: Updated table info

---

## Invoice APIs (`/invoices`)

### 1. Generate Invoice for Session

**GET** `/invoices/session/{sessionId}`

- **Auth**: ADMIN, MANAGER, STAFF
- **Returns**: `InvoiceDTO`

**Invoice Response Structure**:

```json
{
    "sessionId": 10,
    "sessionStatus": "COMPLETED",
    "startTime": "2024-01-20T10:00:00",
    "endTime": "2024-01-20T12:30:00",
    "durationHours": 2.5,
    "tableName": "Bàn 1",
    "tableType": "VIP",
    "tableHourlyRate": 50000,
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0901234567",
    "customerRank": "GOLD",
    "branchName": "Chi nhánh Quận 1",
    "branchAddress": "123 Nguyễn Huệ, Q1",
    "branchPhone": "0281234567",
    "tableRentalCost": 125000,
    "combos": [
        {
            "comboId": 1,
            "comboName": "Combo tiết kiệm",
            "quantity": 1,
            "price": 100000,
            "totalAmount": 100000
        }
    ],
    "combosCost": 100000,
    "products": [
        {
            "productName": "Coca Cola",
            "quantity": 2,
            "unit": "chai",
            "unitPrice": 15000,
            "totalAmount": 30000
        }
    ],
    "productsCost": 30000,
    "equipments": [
        {
            "equipmentName": "Cơ gỗ",
            "quantity": 1,
            "startTime": "2024-01-20T10:00:00",
            "endTime": "2024-01-20T12:30:00",
            "hourlyRate": 10000,
            "durationHours": 2.5,
            "totalAmount": 25000,
            "isReturned": true
        }
    ],
    "equipmentsCost": 25000,
    "subtotal": 280000,
    "discountAmount": 28000,
    "discountReason": "Giảm giá theo hạng khách hàng: Gold",
    "totalAmount": 252000,
    "notes": "Ghi chú của session",
    "generatedAt": "2024-01-20T12:35:00",
    "generatedBy": "System"
}
```

**Invoice Calculation Logic**:

1. **tableRentalCost** = durationHours × tableHourlyRate
2. **combosCost** = Sum of all SessionCombo.totalAmount
3. **productsCost** = Sum of all SessionProduct.totalAmount
4. **equipmentsCost** = Sum of all SessionEquipment.totalAmount
5. **subtotal** = tableRentalCost + combosCost + productsCost + equipmentsCost
6. **discountAmount** = subtotal × customerRank.discountPercent / 100
7. **totalAmount** = subtotal - discountAmount

---

## Summary of Features Completed

✅ **Product Management**: Full CRUD + stock management + low stock alerts  
✅ **Equipment Management**: Full CRUD + availability tracking  
✅ **ComboItem Management**: Add/remove items from combos  
✅ **Session Products**: Order products for session with auto stock deduction  
✅ **Session Equipment**: Rent/return equipment with time-based billing  
✅ **Table Status Management**: Toggle table status (AVAILABLE, IN_USE, MAINTENANCE, RESERVED)  
✅ **Invoice Generation**: Complete invoice with all costs, discounts, and customer info

---

## Important Notes

1. **Stock Management**:
    - Thêm Product vào Session → tự động trừ stockQuantity
    - Xóa SessionProduct → tự động cộng lại stockQuantity

2. **Equipment Availability**:
    - Thuê Equipment → trừ availableQuantity
    - Trả Equipment (return) → cộng lại availableQuantity
    - Chỉ tính totalAmount khi trả equipment (endTime được set)

3. **Invoice Generation**:
    - Tự động tính tổng tiền từ tất cả nguồn (table, combo, product, equipment)
    - Tự động áp dụng giảm giá theo hạng khách hàng
    - Equipment chưa trả (endTime = null) sẽ có totalAmount = 0 trong invoice

4. **Table Status**:
    - AVAILABLE: Bàn trống, sẵn sàng
    - IN_USE: Đang có khách chơi
    - MAINTENANCE: Đang bảo trì
    - RESERVED: Đã được đặt trước

5. **Combo Design** (Reminder):
    - Combo KHÔNG bao gồm giờ chơi (Option A)
    - Combo chỉ chứa Product và Equipment
    - Giờ chơi tính từ BilliardSession (endTime - startTime)
