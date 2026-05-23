"use client";
import {
    useRouter,
    useSearchParams,
} from "next/dist/client/components/navigation";
import React, { useEffect, useMemo } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import AccountListTabs from "./accountList/AccountListTabs";
import AccountCurrentDetailTab from "./accountCurrentDetail/AccountCurrentDetailTab";
import QueryTabs from "@/components/common/QueryTabs";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

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
        requireAdmin: true, // Chỉ ADMIN mới được xem
    },
    {
        value: "sessions",
        label: "Phiên đăng nhập",
        content: <div>Phiên đăng nhập</div>,
    },
];

const AccountPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    // Filter tabs dựa trên quyền: MANAGER không được xem danh sách tài khoản
    const filteredTabs = useMemo(() => {
        return ACCOUNT_TABS.filter((tab) => {
            if (tab.requireAdmin) {
                return isAdmin;
            }
            return true;
        });
    }, [isAdmin]);

    return <QueryTabs tabs={filteredTabs} defaultTab="profile" />;
};

export default AccountPage;
