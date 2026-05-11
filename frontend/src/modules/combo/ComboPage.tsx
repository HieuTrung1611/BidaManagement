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
import ComboListTab from "./ComboListTab";

const COMBO_TABS = [
    {
        value: "list",
        label: "Danh sách combo",
        content: <ComboListTab />,
    },
    {
        value: "overview",
        label: "Thống kê",
        content: (
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê combo</CardTitle>
                    <CardDescription>
                        Xem thống kê doanh số và độ phổ biến của các combo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    Chức năng thống kê đang được phát triển...
                </CardContent>
            </Card>
        ),
    },
];

const ComboPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("list");

    useEffect(() => {
        const tabParam = searchParams.get("tab");

        if (tabParam && COMBO_TABS.some((tab) => tab.value === tabParam)) {
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
                {COMBO_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {COMBO_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default ComboPage;
