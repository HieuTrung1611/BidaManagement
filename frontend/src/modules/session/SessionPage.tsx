"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TableCard } from "./TableCard";
import { SessionDetailCard } from "./SessionDetailCard";
import { useTableBilliards } from "@/hooks/useTableBilliard";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import { useBranches } from "@/hooks/useBranch";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { Loader2 } from "lucide-react";
import { useSessions } from "@/hooks/useSession";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { IBilliardSessionResponse } from "@/types/session";

export const SessionPage: React.FC = () => {
    const { user } = useAuth();
    const { managedBranchId, isLoading: isLoadingBranch } = useManagedBranch();
    const { branches, isLoading: isLoadingBranches } = useBranches();

    const [selectedBranchId, setSelectedBranchId] = useState<
        number | undefined
    >(undefined);
    const [selectedTable, setSelectedTable] =
        useState<ITableBilliardResponse | null>(null);
    const [selectedSession, setSelectedSession] =
        useState<IBilliardSessionResponse | null>(null);

    const isAdmin = user?.role === UserRole.ADMIN;
    const isAdminLike = isAdmin || user?.role === UserRole.MANAGER;

    useEffect(() => {
        if (managedBranchId && !selectedBranchId) {
            setSelectedBranchId(managedBranchId);
        }
    }, [managedBranchId, selectedBranchId]);

    const currentBranchId = isAdminLike ? selectedBranchId : managedBranchId;

    const {
        tableBilliards: tables,
        isLoading: isLoadingTables,
        mutate: mutateTables,
    } = useTableBilliards(
        { page: 0, size: 1000 },
        currentBranchId,
        !!currentBranchId,
    );

    const { sessions: activeSessions, mutate: mutateSessions } = useSessions(
        undefined,
        undefined,
        "ONGOING",
        { page: 0, size: 1000 },
        currentBranchId,
        !!currentBranchId,
    );

    const handleStartSession = (tableId: number) => {
        const table = tables.find((t) => t.id === tableId);
        if (table) {
            setSelectedTable(table);
            setSelectedSession(null);
        }
    };

    const handleViewSession = (tableId: number) => {
        const table = tables.find((t) => t.id === tableId);
        const session = activeSessions.find((s) => s.tableId === tableId);
        if (table && session) {
            setSelectedTable(table);
            setSelectedSession(session);
        }
    };

    const handleSuccess = () => {
        mutateTables();
        mutateSessions();
    };
    const handleCloseDetail = () => {
        setSelectedTable(null);
        setSelectedSession(null);
    };

    const inUse = tables.filter((t) => t.status === "IN_USE").length;
    const available = tables.filter((t) => t.status === "AVAILABLE").length;

    if (isLoadingBranch || isLoadingBranches) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdminLike && !managedBranchId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
                <p>Không tìm thấy thông tin chi nhánh</p>
                <p className="text-sm">Vui lòng liên hệ quản trị viên</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Compact toolbar */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-gray-800">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    Quản lý phiên chơi
                </span>

                {isAdmin && (
                    <select
                        value={selectedBranchId ?? ""}
                        onChange={(e) =>
                            setSelectedBranchId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            )
                        }
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <option value="">Chọn chi nhánh</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                )}

                {currentBranchId && !isLoadingTables && (
                    <div className="ml-auto flex items-center gap-3 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                            Tổng:{" "}
                            <span className="font-semibold text-gray-800 dark:text-white">
                                {tables.length}
                            </span>
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                            Đang chơi:{" "}
                            <span className="font-semibold">{inUse}</span>
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                            Trống:{" "}
                            <span className="font-semibold">{available}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            {!currentBranchId ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center text-sm text-gray-400">
                    Chọn chi nhánh để xem và quản lý các bàn
                </div>
            ) : isLoadingTables ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : tables.length === 0 ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center text-sm text-gray-400">
                    Không có bàn nào trong chi nhánh này
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {tables.map((table) => (
                                <TableCard
                                    key={table.id}
                                    table={table}
                                    onStartSession={handleStartSession}
                                    onViewSession={handleViewSession}
                                    isSelected={selectedTable?.id === table.id}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <SessionDetailCard
                            table={selectedTable}
                            session={selectedSession}
                            onClose={handleCloseDetail}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
