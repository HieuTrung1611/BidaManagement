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
import ProductListTab from "./ProductListTab";

const PRODUCT_TABS = [
    {
        value: "list",
        label: "Danh sách sản phẩm",
        content: <ProductListTab />,
    },
    {
        value: "overview",
        label: "Thống kê",
        content: (
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê sản phẩm</CardTitle>
                    <CardDescription>
                        Xem thống kê bán hàng và tồn kho sản phẩm.
                    </CardDescription>
                </CardHeader>
                <CardContent>Chức năng thống kê đang được phát triển...</CardContent>
            </Card>
        ),
    },
];

const ProductPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("list");

    useEffect(() => {
        const tabParam = searchParams.get("tab");

        if (tabParam && PRODUCT_TABS.some((tab) => tab.value === tabParam)) {
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
                {PRODUCT_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {PRODUCT_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default ProductPage;
