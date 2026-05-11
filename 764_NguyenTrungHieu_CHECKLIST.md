# Checklist

## ✅ Đã hoàn thành

- [x] Tạo module `Loại bàn` frontend
  - [x] `frontend/src/types/tableBilliardType.ts`
  - [x] `frontend/src/services/tableBilliardTypeService.ts`
  - [x] `frontend/src/hooks/useTableBilliardType.ts`
  - [x] `frontend/src/modules/table/typeTable/*`

- [x] Tạo tab quản lý bàn theo chi nhánh frontend
  - [x] `frontend/src/modules/table/tableList/TableListTab.tsx`
  - [x] `frontend/src/modules/table/tableList/TableBilliardModal.tsx`
  - [x] `frontend/src/modules/table/tableList/useTableBilliardAction.tsx`

- [x] Thêm phân quyền frontend
  - [x] Admin được chọn chi nhánh khi thêm bàn
  - [x] Manager chỉ thao tác chi nhánh của mình
  - [x] Manager không chọn chi nhánh trong modal

- [x] Sử dụng `MoneyVndInput` cho trường giá tiền

- [x] Tạo logic select-all cho danh sách bàn
  - [x] `useAllTableBilliards(...)`
  - [x] Tắt pagination trong DataTable cho tab bàn

- [x] Bổ sung fallback backend /all
  - [x] `frontend/src/services/tableBilliardTypeService.ts` fallback sang paged endpoint nếu không thành công

- [x] Hoàn thiện backend method `getAllTableBilliardTypes()`
  - [x] `backend/src/main/java/com/mhbilliards/billiards_management/service/tableBilliardType/TableBilliardTypeServiceImpl.java`

## ⚠️ Chưa hoàn thành / cần xác thực

- [ ] Khởi lại backend và đảm bảo server hoạt động ổn định
- [ ] Xác thực endpoint `/table-billiard-types/all` trả đúng dữ liệu
- [ ] Xác thực endpoint `/table-billiard` filter branch đúng với quyền admin/manager
- [ ] Thêm bảo mật backend để enforce quyền manager nếu cần
- [ ] Kiểm thử UI thực tế để đảm bảo Select `Loại bàn` hiển thị dữ liệu
- [ ] Cập nhật logic `zoneId` nếu cần hỗ trợ chọn zone trong modal

## Ghi chú

- Hiện tại frontend đã sẵn sàng hiển thị dữ liệu đầy đủ nếu backend trả đúng dữ liệu.
- Nếu dropdown `Loại bàn` vẫn rỗng, cần kiểm tra response API và dữ liệu `id` của loại bàn.
