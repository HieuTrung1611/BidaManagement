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
import EquipmentListTab from "./EquipmentListTab";

const EQUIPMENT_TABS = [
    {
        value: "list",
        label: "Danh sách thiết bị",
        content: <EquipmentListTab />,
    },
    {
        value: "overview",
        label: "Thống kê",
        content: (
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê thiết bị</CardTitle>
                    <CardDescription>
                        Xem thống kê tình trạng và lịch sử cho thuê thiết bị.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    Chức năng thống kê đang được phát triển...
                </CardContent>
            </Card>
        ),
    },
];

const EquipmentPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("list");

    useEffect(() => {
        const tabParam = searchParams.get("tab");

        if (tabParam && EQUIPMENT_TABS.some((tab) => tab.value === tabParam)) {
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
                {EQUIPMENT_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {EQUIPMENT_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default EquipmentPage;
