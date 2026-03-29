"use client";

import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
    value: string;
    label: string;
    content: React.ReactNode;
};

type Props = {
    tabs: TabItem[];
    defaultTab?: string;
    queryKey?: string;
};

export default function QueryTabs({
    tabs,
    defaultTab,
    queryKey = "tab",
}: Props) {
    const router = useRouter();

    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);

    useEffect(() => {
        const tabParam = searchParams.get(queryKey);

        if (tabParam && tabs.some((t) => t.value === tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams, tabs, queryKey]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);

        const params = new URLSearchParams(searchParams.toString());

        params.set(queryKey, value);

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full">
            <TabsList>
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
