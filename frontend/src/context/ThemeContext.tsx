"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<Theme>("light");
    const [isInitialized, setIsInitialized] = useState(false);
    const isMounted = useIsMounted();

    useEffect(() => {
        // This code will only run on the client side
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const initialTheme = savedTheme || "light"; // Default to light theme

        setTheme(initialTheme);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("theme", theme);
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [theme, isInitialized]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    // Always provide the context, but control visibility for hydration
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {!isMounted ? (
                <div style={{ visibility: "hidden" }}>{children}</div>
            ) : (
                children
            )}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
