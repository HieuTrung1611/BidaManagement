import QueryTabs from "@/components/common/QueryTabs";
import React from "react";
import BranchListTabs from "./branchList/BranchListTabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const BRANCH_TABS = [
    {
        value: "list-branches",
        label: "Danh sách chi nhánh",
        content: <BranchListTabs />,
    },
    {
        value: "dashboard-branches",
        label: "Báo cáo chi nhánh",
        content: (
            <Card>
                <CardHeader>
                    <CardTitle>Báo cáo chi nhánh</CardTitle>
                    <CardDescription>
                        Tính năng đang được phát triển.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Vui lòng quay lại sau để xem các chỉ số tổng quan về
                        hiệu suất chi nhánh.
                    </p>
                </CardContent>
            </Card>
        ),
    },
];

const BranchPage = () => {
    return <QueryTabs tabs={BRANCH_TABS} defaultTab="list-branches" />;
};

export default BranchPage;
