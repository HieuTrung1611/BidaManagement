import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import EmployeePositionTab from "./employeePosition/EmployeePositionTab";
import EmployeeListTab from "./EmployeeListTab";
import EmployeeShiftTab from "./employeeShift/EmployeeShiftTab";

const EMPLOYEE_TABS = [
    {
        value: "overview",
        label: "Thống kê",
        content: (
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê</CardTitle>
                    <CardDescription>
                        Xem các chỉ số chính và hoạt động dự án gần đây của bạn.
                    </CardDescription>
                </CardHeader>

                <CardContent>Nội dung thống kê</CardContent>
            </Card>
        ),
    },
    {
        value: "list",
        label: "Danh sách",
        content: <EmployeeListTab />,
    },
    {
        value: "employeePositions",
        label: "Vị trí nhân viên",
        content: <EmployeePositionTab />,
    },
    {
        value: "employeeShifts",
        label: "Ca làm việc",
        content: <EmployeeShiftTab />,
    },
];

const EmployeePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const tabParam = searchParams.get("tab");

        if (tabParam && EMPLOYEE_TABS.some((tab) => tab.value === tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleTabChange = (tabValue: string) => {
        setActiveTab(tabValue);

        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabValue);

        router.replace(`?${params.toString()}`, {
            scroll: false,
        });
    };

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full">
            <TabsList>
                {EMPLOYEE_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {EMPLOYEE_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default EmployeePage;
