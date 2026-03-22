"use client";

import React from "react";
import { User, LogOut, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

const UserDropdown: React.FC = () => {
    const router = useRouter();

    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            // Nếu API logout fail, vẫn redirect về login page
            router.push("/login");
        }
    };

    const handleViewProfile = () => {
        router.push(ROUTES.ACCOUNT.path);
    };

    // Nếu không có thông tin user, hiển thị avatar mặc định
    const displayName = user?.username || "User";
    const displayRole = user?.role || "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2 transition-colors">
                    <div className="relative">
                        {/* Temporary placeholder while we don't have avatar images */}
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        {/* Online status indicator */}
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800"></span>
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-neutral-700 dark:text-neutral-300 font-medium">
                            {displayName}
                        </div>
                        {displayRole && (
                            <div className="text-neutral-500 dark:text-neutral-400 text-xs">
                                {displayRole}
                            </div>
                        )}
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {displayName}
                        </p>

                        {displayRole && (
                            <p className="text-xs leading-none text-blue-600 dark:text-blue-400">
                                Role: {displayRole}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleViewProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin tài khoản</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
