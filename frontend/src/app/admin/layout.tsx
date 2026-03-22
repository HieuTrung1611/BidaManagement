"use client";

import AdminFooter from "@/components/layout/AdminFooter";
import AppHeader from "@/components/layout/AppHeader";
import Backdrop from "@/components/layout/Backdrop";
import Sidebar from "@/components/layout/SideBar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { TitleProvider } from "@/context/TitleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
          ? "lg:ml-[290px]"
          : "lg:ml-[90px]";

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar and Backdrop */}
            <Sidebar />
            <Backdrop />
            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${mainContentMargin}`}>
                {/* Header */}
                <AppHeader />
                {/* Page Content */}
                <div className="flex-1 pt-4 md:pt-6 px-12 md:px-16">
                    {children}
                </div>
                <AdminFooter />
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <TitleProvider>
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </TitleProvider>
        </SidebarProvider>
    );
}
