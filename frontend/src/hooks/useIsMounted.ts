"use client";

import { useEffect, useState } from "react";

/**
 * Hook to determine if component has mounted on the client side.
 * Useful for avoiding hydration mismatches when using browser APIs.
 *
 * @returns boolean indicating if component is mounted on client
 */
export const useIsMounted = (): boolean => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
};
