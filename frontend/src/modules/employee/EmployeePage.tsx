import React, { useEffect, useState, useMemo } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

const EMPLOYEE_TABS = [
    {
        value: "overview",
        label: "Thống kê",
        requireAdmin: true, // Chỉ ADMIN
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
        requireAdmin: true, // Chỉ ADMIN
        content: <EmployeePositionTab />,
    },
    {
        value: "employeeShifts",
        label: "Ca làm việc",
        requireAdmin: true, // Chỉ ADMIN
        content: <EmployeeShiftTab />,
    },
];

const EmployeePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;
    const [activeTab, setActiveTab] = useState("list");

    // Filter tabs dựa trên quyền: MANAGER chỉ được xem tab "Danh sách"
    const filteredTabs = useMemo(() => {
        return EMPLOYEE_TABS.filter((tab) => {
            if (tab.requireAdmin) {
                return isAdmin;
            }
            return true;
        });
    }, [isAdmin]);

    useEffect(() => {
        const tabParam = searchParams.get("tab");

        if (tabParam && filteredTabs.some((tab) => tab.value === tabParam)) {
            setActiveTab(tabParam);
        } else {
            // Nếu tab không hợp lệ hoặc không có quyền, set về tab đầu tiên
            setActiveTab(filteredTabs[0]?.value || "list");
        }
    }, [searchParams, filteredTabs]);

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
                {filteredTabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {filteredTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default EmployeePage;
