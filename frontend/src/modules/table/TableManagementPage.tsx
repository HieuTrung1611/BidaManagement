import QueryTabs from "@/components/common/QueryTabs";
import React from "react";

const TABLE_TABS = [
    {
        value: "list-tables",
        label: "Danh sách bàn",
        content: <div>Danh sách bàn</div>,
    },
    {
        value: "type-tables",
        label: "Loại bàn",
        content: <div>Loại bàn</div>,
    },
];

const TableManagementPage = () => {
    return <QueryTabs tabs={TABLE_TABS} defaultTab="list-tables" />;
};

export default TableManagementPage;
