import QueryTabs from "@/components/common/QueryTabs";
import React from "react";
import TableListTab from "./tableList/TableListTab";
import TableTypeTab from "./typeTable/TableTypeTab";

const TABLE_TABS = [
    {
        value: "list-tables",
        label: "Danh sách bàn",
        content: <TableListTab />,
    },
    {
        value: "type-tables",
        label: "Loại bàn",
        content: <TableTypeTab />,
    },
];

const TableManagementPage = () => {
    return <QueryTabs tabs={TABLE_TABS} defaultTab="list-tables" />;
};

export default TableManagementPage;
