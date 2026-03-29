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
};

export default ROUTES;
