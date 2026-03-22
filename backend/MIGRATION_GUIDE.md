# Database Migration Guide: UserRole to EmployeePosition

## Tổng quan

Hệ thống phân quyền đã được thay đổi từ enum `UserRole` sang sử dụng bảng `EmployeePosition` để linh hoạt hơn trong việc quản lý quyền hạn.

## Thay đổi Database Schema

### 1. Thêm cột position_id vào bảng users

```sql
-- Thêm constraint foreign key
ALTER TABLE users
ADD COLUMN position_id BIGINT;

ALTER TABLE users
ADD CONSTRAINT FK_users_position
FOREIGN KEY (position_id) REFERENCES employee_positions(id);
```

### 2. Tạo dữ liệu EmployeePosition tương ứng với UserRole cũ

```sql
-- Tạo các position tương ứng với enum cũ
INSERT INTO employee_positions (name, code, hourly_rate, created_at, updated_at) VALUES
('Administrator', 'ADMIN', 50.0, NOW(), NOW()),
('User', 'USER', 20.0, NOW(), NOW()),
('Customer', 'CUSTOMER', 0.0, NOW(), NOW()),
('Manager', 'MANAGER', 40.0, NOW(), NOW()),
('Employee', 'EMPLOYEE', 25.0, NOW(), NOW());
```

### 3. Migrate dữ liệu từ role sang position_id

```sql
-- Update users với position tương ứng
UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'ADMIN' LIMIT 1
)
WHERE role = 'ADMIN';

UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'USER' LIMIT 1
)
WHERE role = 'USER';

UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'CUSTOMER' LIMIT 1
)
WHERE role = 'CUSTOMER';

UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'MANAGER' LIMIT 1
)
WHERE role = 'MANAGER';

UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'EMPLOYEE' LIMIT 1
)
WHERE role = 'EMPLOYEE';
```

### 4. Đặt position_id NOT NULL và xóa cột role cũ

```sql
-- Đảm bảo tất cả user đã có position_id
UPDATE users
SET position_id = (
    SELECT id FROM employee_positions WHERE code = 'USER' LIMIT 1
)
WHERE position_id IS NULL;

-- Đặt constraint NOT NULL
ALTER TABLE users
MODIFY COLUMN position_id BIGINT NOT NULL;

-- Xóa cột role cũ (sau khi đã test kỹ)
ALTER TABLE users DROP COLUMN role;
```

## Kiểm tra Migration

```sql
-- Kiểm tra tất cả user đã có position
SELECT u.id, u.username, u.email, ep.name, ep.code
FROM users u
JOIN employee_positions ep ON u.position_id = ep.id;

-- Kiểm tra không có user nào thiếu position
SELECT COUNT(*) as users_without_position
FROM users
WHERE position_id IS NULL;
```

## Lưu ý quan trọng

1. **Backup database** trước khi thực hiện migration
2. **Test kỹ** trên environment dev/staging trước khi apply lên production
3. **Tạo script rollback** để có thể quay lại nếu cần
4. **Application downtime**: Cần restart application sau khi migration
5. **JWT tokens cũ** sẽ invalid, user cần login lại

## Rollback Script (nếu cần)

```sql
-- Thêm lại cột role
ALTER TABLE users
ADD COLUMN role VARCHAR(50);

-- Restore role từ position
UPDATE users u
JOIN employee_positions ep ON u.position_id = ep.id
SET u.role = ep.code;

-- Xóa constraint và cột position_id
ALTER TABLE users DROP FOREIGN KEY FK_users_position;
ALTER TABLE users DROP COLUMN position_id;

-- Set default role
UPDATE users SET role = 'USER' WHERE role IS NULL;
```

## Thay đổi Frontend

- Enum `EUserRole` trong `auth.ts` đã được deprecated
- Sử dụng `EmployeePosition` từ API thay thế
- Update các component sử dụng role để sử dụng position

## Migration Checklist

- [ ] Backup database
- [ ] Apply schema changes
- [ ] Insert default employee positions
- [ ] Migrate user role data
- [ ] Set NOT NULL constraint
- [ ] Test login/logout functionality
- [ ] Test JWT token generation
- [ ] Test authorization/permissions
- [ ] Update frontend code
- [ ] Deploy to production
- [ ] Monitor for issues
