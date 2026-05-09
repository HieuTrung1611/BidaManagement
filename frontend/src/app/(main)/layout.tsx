import MainFooter from "@/components/layout/MainFooter";
import MainHeader from "@/components/layout/MainHeader";
import React from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#06090d] text-neutral-100">
            <MainHeader />
            <main>{children}</main>
            <MainFooter />
        </div>
    );
}