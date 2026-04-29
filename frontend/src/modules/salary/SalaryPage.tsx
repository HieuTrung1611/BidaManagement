"use client";

import React from "react";
import QueryTabs from "@/components/common/QueryTabs";
import { useBranches } from "@/hooks/useBranch";
import SalaryManagementTab from "./SalaryManagementTab";
import SalaryStatisticsTab from "./SalaryStatisticsTab";

const SalaryPage: React.FC = () => {
    const { branches } = useBranches();

    return (
        <QueryTabs
            defaultTab="management"
            tabs={[
                {
                    value: "management",
                    label: "Bảng lương",
                    content: <SalaryManagementTab branches={branches} />,
                },
                {
                    value: "statistics",
                    label: "Thống kê",
                    content: <SalaryStatisticsTab branches={branches} />,
                },
            ]}
        />
    );
};

export default SalaryPage;
