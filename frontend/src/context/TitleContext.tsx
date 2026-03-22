"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import ROUTES from "@/constants/routes";

interface TitleContextType {
    title: string;
    setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

// Function to find matching route based on pathname
const findRouteByPath = (pathname: string) => {
    const routeEntries = Object.values(ROUTES);

    // First try exact match
    let matchedRoute = routeEntries.find((route) => route.path === pathname);

    // If no exact match, try pattern matching for dynamic routes
    if (!matchedRoute) {
        matchedRoute = routeEntries.find((route) => {
            const routePattern = route.path.replace(/\[.*?\]/g, "[^/]+");
            const regex = new RegExp(`^${routePattern}$`);
            return regex.test(pathname);
        });
    }

    return matchedRoute;
};

export const TitleProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const pathname = usePathname();
    const [title, setTitle] = useState("Trang chủ");

    useEffect(() => {
        const matchedRoute = findRouteByPath(pathname);
        if (matchedRoute) {
            setTitle(matchedRoute.title);
        }
    }, [pathname]);

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
};

export const useTitle = () => {
    const context = useContext(TitleContext);
    if (context === undefined) {
        throw new Error("useTitle must be used within a TitleProvider");
    }
    return context;
};
