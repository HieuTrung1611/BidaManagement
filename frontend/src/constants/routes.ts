import path from "path";

const ROUTES = {
    HOME: {
        path: "/",
        title: "Trang chủ",
    },
    HOMEADMIN: {
        path: "/admin/dashboard",
        title: "Trang chủ",
    },

    EMPLOYEE: {
        path: "/admin/employees",
        title: "Quản lý nhân viên",
    },

    EMPLOYEEATTENDANCE: {
        path: "/admin/employees-attendance",
        title: "Điểm danh nhân viên",
    },

    SALARY: {
        path: "/admin/salaries",
        title: "Bảng lương",
    },

    CUSTOMER: {
        path: "/admin/customers",
        title: "Quản lý khách hàng",
    },

    ACCOUNT: {
        path: "/admin/accounts",
        title: "Quản lý tài khoản",
    },

    TABLEMANAGEMENT: {
        path: "/admin/table-management",
        title: "Quản lý bàn",
    },

    BRANCH: {
        path: "/admin/branches",
        title: "Quản lý chi nhánh",
    },
    BRANCHDETAIL: {
        path: "/admin/branches/[id]",
        title: "Chi tiết chi nhánh",
        parent: "BRANCH",
    },

    PRODUCT: {
        path: "/admin/products",
        title: "Quản lý sản phẩm",
    },

    EQUIPMENT: {
        path: "/admin/equipments",
        title: "Quản lý thiết bị",
    },

    COMBO: {
        path: "/admin/combos",
        title: "Quản lý combo",
    },

    SESSION: {
        path: "/admin/sessions",
        title: "Quản lý phiên chơi",
    },
};

export default ROUTES;
