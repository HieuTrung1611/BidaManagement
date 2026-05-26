# Loại bỏ quan hệ Branch khỏi Customer - Summary

**Ngày thực hiện:** 25/05/2026  
**Mục đích:** Biến Customer thành dữ liệu chung giữa các chi nhánh, không còn gắn với branch cụ thể

---

## 📋 Tổng quan thay đổi

### Trước khi thay đổi:

- ❌ Mỗi customer gắn với 1 branch cụ thể
- ❌ Phải chọn branch khi tạo customer
- ❌ Face recognition chỉ tìm trong 1 branch
- ❌ Customer không thể dùng chung giữa các chi nhánh

### Sau khi thay đổi:

- ✅ Customer là dữ liệu chung toàn hệ thống
- ✅ Không cần chọn branch khi tạo customer
- ✅ Face recognition tìm kiếm toàn hệ thống
- ✅ Customer có thể đến bất kỳ chi nhánh nào

---

## 🔧 Chi tiết thay đổi

### 1. Backend - Entity Layer

#### **Customer.java** (/backend/src/main/java/.../entity/Customer.java)

**Đã xóa:**

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "branch_id", nullable = false)
Branch branch;
```

**Đã xóa imports:**

- `jakarta.persistence.FetchType`
- `jakarta.persistence.JoinColumn`
- `jakarta.persistence.ManyToOne`

---

### 2. Backend - DTO Layer

#### **CustomerRequest.java** (/backend/src/main/java/.../dto/customer/CustomerRequest.java)

**Đã xóa:**

```java
@NotNull(message = "Chi nhánh không được để trống")
Long branchId;
```

#### **CustomerResponse.java** (/backend/src/main/java/.../dto/customer/CustomerResponse.java)

**Đã xóa:**

```java
BranchResponse branch;
```

---

### 3. Backend - Mapper Layer

#### **CustomerMapper.java** (/backend/src/main/java/.../mapper/CustomerMapper.java)

**Đã xóa:**

```java
@Mapping(source = "branchId", target = "branch.id")  // trong toEntity()
@Mapping(target = "branch", ignore = true)           // trong updateEntity()
```

---

### 4. Backend - Specification Layer

#### **CustomerSpecification.java** (/backend/src/main/java/.../specification/CustomerSpecification.java)

**Đã xóa 2 methods:**

```java
public static Specification<Customer> hasBranchId(Long branchId) { ... }
public static Specification<Customer> hasBranch(Long branchId) { ... }
```

---

### 5. Backend - Service Layer

#### **CustomerServiceImpl.java** (/backend/src/main/java/.../service/customer/CustomerServiceImpl.java)

**Đã xóa dependencies:**

```java
private final BranchRepository branchRepository;
private final CurrentUserAccessService currentUserAccessService;
```

**Đã xóa imports:**

- `com.mhbilliards.billiards_management.repository.BranchRepository`
- `com.mhbilliards.billiards_management.service.base.CurrentUserAccessService`

**Thay đổi trong từng method:**

1. **createCustomer()** - Đã xóa:
    - `Long branchId = currentUserAccessService.resolveAccessibleBranchId(request.getBranchId());`
    - `branchRepository.findById(branchId)` validation
    - `customer.setBranch(branchRepository.getReferenceById(branchId));`

2. **getCustomerById()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

3. **searchCustomers()** - Đã xóa:
    - `Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);`
    - `.where(CustomerSpecification.hasBranchId(accessibleBranchId))`

4. **updateCustomer()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

5. **deleteCustomer()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

6. **deactivateCustomer()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

7. **reactivateCustomer()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

8. **uploadCustomerPhoto()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

9. **updateCustomerNotes()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

10. **recordCustomerVisit()** - Đã xóa:
    - `currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());`

11. **recognizeFaceFromImage()** - **QUAN TRỌNG:**
    - **Trước:**
        ```java
        List<Customer> customersWithFace = customerRepository.findAll(
            CustomerSpecification.hasBranch(branchId)
                .and(CustomerSpecification.hasFaceEmbedding()));
        ```
    - **Sau:**
        ```java
        List<Customer> customersWithFace = customerRepository.findAll(
            CustomerSpecification.hasFaceEmbedding());
        ```
    - **Log message:**
        - Trước: `"Starting face recognition for branch: " + branchId`
        - Sau: `"Starting face recognition (system-wide search)"`
        - Trước: `"Found X customers with face embeddings"`
        - Sau: `"Found X customers with face embeddings (system-wide)"`
    - **Error message:**
        - Trước: `"Không có khách hàng nào với dữ liệu khuôn mặt trong chi nhánh này"`
        - Sau: `"Không có khách hàng nào với dữ liệu khuôn mặt trong hệ thống"`

---

### 6. Frontend - Types

#### **customer.ts** (/frontend/src/types/customer.ts)

**ICustomerRequest - Đã xóa:**

```typescript
branchId: number | null;
```

**ICustomerResponse - Đã xóa:**

```typescript
branch: IBranchResponse;
```

**Đã xóa import:**

```typescript
import { IBranchResponse } from "./branch";
```

---

### 7. Frontend - Components

#### **CustomerModal.tsx** (/frontend/src/modules/customer/CustomerModal.tsx)

**Đã xóa imports:**

```typescript
import Select from "@/components/ui/form/Select";
import { useBranches } from "@/hooks/useBranch";
```

**Đã xóa hooks:**

```typescript
const { branches } = useBranches();
```

**Đã xóa state:**

```typescript
branchId: null,  // Trong formData initial state
```

**Đã xóa computed:**

```typescript
const branchOptions = React.useMemo(
    () =>
        branches.map((branch) => ({
            value: branch.id.toString(),
            label: branch.name,
        })),
    [branches],
);
```

**Đã xóa handlers:**

```typescript
const handleBranchChange = (value: string) => {
    setFormData((prev) => ({
        ...prev,
        branchId: value ? Number(value) : null,
    }));
    if (errors.branchId) {
        setErrors((prev) => ({
            ...prev,
            branchId: "",
        }));
    }
};
```

**Đã xóa validation:**

```typescript
if (!formData.branchId) {
    newErrors.branchId = "Chi nhánh không được để trống";
}
```

**Đã xóa UI field:**

```tsx
<div>
    <Label htmlFor="branchId">
        Chi nhánh <span className="text-red-500">*</span>
    </Label>
    <Select
        options={branchOptions}
        value={formData.branchId?.toString() || ""}
        onChange={handleBranchChange}
        placeholder="Chọn chi nhánh"
        className="h-10 w-full"
    />
    {errors.branchId && (
        <p className="mt-1 text-xs text-red-500">{errors.branchId}</p>
    )}
</div>
```

#### **CustomerDetail.tsx** (/frontend/src/modules/customer/CustomerDetail.tsx)

**Đã xóa UI section:**

```tsx
<div className="grid gap-2">
    <label className="text-sm font-medium text-muted-foreground">
        Chi nhánh
    </label>
    <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
        {customer.branch?.name ?? "Chưa có"}
    </div>
</div>
```

---

### 8. Database Migration

#### **REMOVE_CUSTOMER_BRANCH_MIGRATION.sql** (Mới tạo)

**Script SQL:**

```sql
USE billiards_management;

-- Step 1: Drop foreign key constraint
ALTER TABLE customers
DROP FOREIGN KEY customers_ibfk_1;

-- Step 2: Drop branch_id column
ALTER TABLE customers
DROP COLUMN branch_id;
```

---

## 📊 Tác động của thay đổi

### ✅ Ưu điểm:

1. **Linh hoạt hơn:**
    - Khách hàng có thể đến bất kỳ chi nhánh nào
    - Không cần tạo lại customer khi đến chi nhánh khác
2. **Face Recognition mạnh mẽ hơn:**
    - Tìm kiếm toàn bộ khách hàng trong hệ thống
    - Không bị giới hạn bởi chi nhánh
    - Khách hàng có thể tự quét mặt ở bất kỳ chi nhánh nào

3. **Quản lý đơn giản hơn:**
    - Không cần chọn branch khi tạo customer
    - Giảm validation và access control logic
    - Code sạch hơn, ít dependency hơn

4. **Dữ liệu thống nhất:**
    - Email và phone number unique toàn hệ thống
    - Tránh duplicate customer giữa các chi nhánh

### ⚠️ Lưu ý:

1. **Phải chạy migration SQL trước khi deploy backend mới**
2. **Backup database trước khi chạy migration**
3. **Face recognition sẽ chậm hơn một chút** (do tìm kiếm nhiều customer hơn)
    - Cải thiện: Có thể thêm index vào faceEmbedding column
    - Cải thiện: Có thể cache embeddings trong memory

---

## 🚀 Cách deploy

### 1. Backup Database:

```bash
mysqldump -u root -p billiards_management > backup_before_migration.sql
```

### 2. Chạy Migration:

```bash
mysql -u root -p billiards_management < backend/REMOVE_CUSTOMER_BRANCH_MIGRATION.sql
```

### 3. Verify Migration:

```sql
SELECT * FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'billiards_management'
AND TABLE_NAME = 'customers'
AND COLUMN_NAME = 'branch_id';
-- Kết quả phải trả về 0 rows
```

### 4. Deploy Backend:

```bash
cd backend
./mvnw clean package
./mvnw spring-boot:run
```

### 5. Deploy Frontend:

```bash
cd frontend
npm run build
npm start
```

---

## ✅ Testing Checklist

### Backend:

- [ ] `POST /api/customers` - Tạo customer không cần branchId
- [ ] `PUT /api/customers/{id}` - Update customer không cần branchId
- [ ] `GET /api/customers/{id}` - Response không có branch field
- [ ] `GET /api/customers` - Trả về tất cả customers (không filter branch)
- [ ] `POST /api/customers/recognize-face` - Tìm kiếm toàn hệ thống

### Frontend:

- [ ] CustomerModal không hiển thị dropdown chi nhánh
- [ ] CustomerModal validation không yêu cầu branchId
- [ ] CustomerDetail không hiển thị thông tin chi nhánh
- [ ] Tạo customer thành công
- [ ] Sửa customer thành công
- [ ] Face recognition hoạt động bình thường

### Database:

- [ ] Column `branch_id` đã bị xóa khỏi table `customers`
- [ ] Foreign key constraint đã bị xóa
- [ ] Dữ liệu customer cũ vẫn còn nguyên vẹn

---

## 📝 Notes

- **Face recognition giờ tìm toàn hệ thống** - Nếu có 1000 customers với face embeddings, sẽ phải so sánh với cả 1000 thay vì chỉ 100 trong 1 branch
- **Performance:** Có thể cân nhắc thêm index hoặc caching nếu số lượng customers lớn
- **Backup:** Luôn backup trước khi chạy migration
- **Rollback:** Nếu cần rollback, restore database từ backup và deploy code cũ

---

**Hoàn thành:** 25/05/2026  
**Status:** ✅ Ready for deployment
