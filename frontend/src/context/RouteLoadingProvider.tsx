"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoading from "@/components/common/FullPageLoading";

export default function RouteLoadingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <>
            {loading && <PageLoading />}
            {children}
        </>
    );
}
