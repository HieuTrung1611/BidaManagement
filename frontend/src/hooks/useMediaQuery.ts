"use client";

import { useState, useEffect } from "react";
import { useIsMounted } from "./useIsMounted";

/**
 * Hook to safely handle media queries without hydration mismatches.
 *
 * @param query - The media query string (e.g., '(max-width: 768px)')
 * @param defaultValue - The default value to return during SSR/before mount
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (
    query: string,
    defaultValue: boolean = false,
): boolean => {
    const [matches, setMatches] = useState(defaultValue);
    const isMounted = useIsMounted();

    useEffect(() => {
        if (!isMounted || typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener("change", handler);

        return () => {
            mediaQuery.removeEventListener("change", handler);
        };
    }, [query, isMounted]);

    // Return defaultValue during SSR
    return isMounted ? matches : defaultValue;
};
