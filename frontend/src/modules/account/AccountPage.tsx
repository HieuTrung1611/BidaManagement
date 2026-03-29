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
import AccountCurrentDetailTab from "./accountCurrentDetail/AccountCurrentDetailTab";
import QueryTabs from "@/components/common/QueryTabs";

const ACCOUNT_TABS = [
    {
        value: "profile",
        label: "Thông tin cá nhân",
        content: <AccountCurrentDetailTab />,
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
    return <QueryTabs tabs={ACCOUNT_TABS} defaultTab="profile" />;
};

export default AccountPage;
