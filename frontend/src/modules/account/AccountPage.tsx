"use client";
import {
    useRouter,
    useSearchParams,
} from "next/dist/client/components/navigation";
import React, { useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import AccountListTabs from "./accountList/AccountListTabs";

const ACCOUNT_TABS = [
    {
        value: "profile",
        label: "Thông tin cá nhân",
        content: <div>Thông tin cá nhân</div>,
    },
    {
        value: "list-accounts",
        label: "Danh sách tài khoản",
        content: <AccountListTabs />,
    },
    {
        value: "sessions",
        label: "Phiên đăng nhập",
        content: <div>Phiên đăng nhập</div>,
    },
];

const AccountPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = React.useState("profile");

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam && ACCOUNT_TABS.some((tab) => tab.value === tabParam)) {
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
                {ACCOUNT_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {ACCOUNT_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default AccountPage;
