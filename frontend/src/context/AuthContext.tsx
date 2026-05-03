"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "@/services/authService";

interface IUser {
    username: string;
    role: string;
}

interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const res = await authService.getCurrentUser();
            console.log("[AuthContext] /auth/current-user response:", res);

            if (res.success && res.data?.username && res.data?.role) {
                setUser({
                    username: res.data.username,
                    role: res.data.role,
                });
            } else {
                console.warn(
                    "[AuthContext] Missing user data or role from current-user response",
                    res.data,
                );
                setUser(null);
            }
        } catch (err) {
            console.error("[AuthContext] Failed to load current user", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const reloadUser = async () => {
        await loadUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
