"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Notification, { NotificationType } from "@/components/ui/toast/toast";

// --- 1. ĐỊNH NGHĨA TYPES ---

// Định nghĩa kiểu dữ liệu cho một đối tượng Toast lưu trữ trong state
interface ToastItem {
    id: number;
    type: NotificationType;
    title: string;
    message?: string;
    showIcon: boolean;
    duration?: number;
}

// Định nghĩa kiểu cho Context Value (các hàm có thể gọi từ useToast)
type ToastContextType = {
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
    loading: (title: string, message?: string) => void;
    removeToast: (id: number) => void;
};

// --- 2. KHỞI TẠO CONTEXT VÀ HOOK ---

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// --- 3. TOAST CONTAINER COMPONENT (UI Rendering) ---

// Component này sẽ render danh sách toast ở góc màn hình.
const ToastContainer: React.FC<{
    notifications: ToastItem[];
    removeToast: (id: number) => void;
}> = ({ notifications, removeToast }) => (
    // Đặt cố định ở góc dưới bên phải, z-index cao
    <div className="fixed bottom-4 right-4 z-1000 space-y-3 pointer-events-none">
        {/* AnimatePresence cho phép animation khi toast bị xóa khỏi DOM (exit animation) */}
        <AnimatePresence initial={false}>
            {notifications.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Notification
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        duration={toast.duration}
                        showIcon={toast.showIcon}
                        // Gán hàm removeToast vào onClose của component
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </AnimatePresence>
    </div>
);

// --- 4. TOAST PROVIDER (STATE MANAGEMENT & LOGIC) ---

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // State chứa danh sách toast đang hiển thị
    const [notifications, setNotifications] = useState<ToastItem[]>([]);
    const nextIdRef = useRef(1);
    const timeoutsRef = useRef<Record<number, NodeJS.Timeout>>({});

    const removeToast = (id: number) => {
        setNotifications((prev) => prev.filter((toast) => toast.id !== id));
        // Dọn dẹp timeout khi toast bị xóa
        if (timeoutsRef.current[id]) {
            clearTimeout(timeoutsRef.current[id]);
            delete timeoutsRef.current[id];
        }
    };

    const addToast = (
        type: NotificationType,
        title: string,
        message?: string,
        duration?: number,
    ) => {
        const id = nextIdRef.current++;
        const newToast: ToastItem = {
            id,
            type,
            title,
            message,
            showIcon: true,
            duration,
        };

        setNotifications((prev) => [...prev, newToast]);

        // Logic tự động đóng toast
        if (duration && type !== "loading") {
            const timer = setTimeout(() => {
                removeToast(id);
            }, duration);
            // Lưu trữ timer để có thể hủy bỏ nếu cần
            timeoutsRef.current[id] = timer;
        }
    };

    // Helper functions sử dụng hàm addToast
    const success = (title: string, message?: string, duration = 3000) =>
        addToast("success", title, message, duration);

    const error = (title: string, message?: string, duration = 5000) =>
        addToast("error", title, message, duration);

    const warning = (title: string, message?: string, duration = 4000) =>
        addToast("warning", title, message, duration);

    const info = (title: string, message?: string, duration = 4000) =>
        addToast("info", title, message, duration);

    // Loading toast không có duration và không tự đóng
    const loading = (title: string, message?: string) =>
        addToast("loading", title, message);

    const contextValue: ToastContextType = {
        success,
        error,
        warning,
        info,
        loading,
        removeToast,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {/* RENDER TOAST CONTAINER Ở ĐÂY */}
            <ToastContainer
                notifications={notifications}
                removeToast={removeToast}
            />
        </ToastContext.Provider>
    );
};
