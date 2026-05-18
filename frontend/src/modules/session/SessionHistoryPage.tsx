"use client";

import React, { useState, useMemo } from "react";
import { useSessionHistory } from "@/hooks/useSession";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import { useBranches } from "@/hooks/useBranch";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { ISessionWithDetails, SessionStatus } from "@/types/session";
import { formatCurrency } from "@/utils/formatCurrency";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    User,
    TableProperties,
    ShoppingCart,
    Package,
    Wrench,
    Loader2,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDisplayDate = (isoDate: string) =>
    new Date(isoDate + "T00:00:00").toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

const toInputDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const STATUS_CONFIG: Record<SessionStatus, { label: string; cls: string }> = {
    ONGOING: {
        label: "Đang chơi",
        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    COMPLETED: {
        label: "Hoàn thành",
        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    CANCELLED: {
        label: "Đã hủy",
        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
};

// ── SessionCard ───────────────────────────────────────────────────────────────

const SessionCard: React.FC<{ session: ISessionWithDetails }> = ({
    session,
}) => {
    const [expanded, setExpanded] = useState(false);
    const hasItems =
        session.products.length > 0 ||
        session.combos.length > 0 ||
        session.equipments.length > 0;

    const statusCfg = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.COMPLETED;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                {/* Left info */}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {/* Table */}
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white">
                        <TableProperties
                            size={14}
                            className="shrink-0 text-blue-500"
                        />
                        {session.tableName ?? `Bàn #${session.tableId}`}
                        <span className="font-normal text-gray-400">
                            ({session.tableType})
                        </span>
                    </span>

                    {/* Customer */}
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                        <User size={14} className="shrink-0 text-purple-500" />
                        {session.customerName ? (
                            <>
                                {session.customerName}
                                {session.customerPhone && (
                                    <span className="text-gray-400">
                                        {" "}
                                        — {session.customerPhone}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="italic text-gray-400">
                                Khách vãng lai
                            </span>
                        )}
                    </span>

                    {/* Time */}
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                        <Clock size={14} className="shrink-0 text-orange-500" />
                        {formatTime(session.startTime)}
                        {session.endTime && (
                            <> → {formatTime(session.endTime)}</>
                        )}
                        {session.durationHours > 0 && (
                            <span className="text-gray-400">
                                ({session.durationHours.toFixed(2)}h)
                            </span>
                        )}
                    </span>
                </div>

                {/* Right: badge + amount + toggle */}
                <div className="flex shrink-0 items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.cls}`}>
                        {statusCfg.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(session.totalAmount)}
                    </span>
                    {hasItems && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            aria-label={expanded ? "Thu gọn" : "Xem chi tiết"}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
                            {expanded ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Detail panel */}
            {expanded && hasItems && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Food & Drinks */}
                        {session.products.length > 0 && (
                            <section>
                                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <ShoppingCart size={12} /> Đồ ăn / uống
                                </h4>
                                <ul className="space-y-1.5">
                                    {session.products.map((p) => (
                                        <li
                                            key={p.id}
                                            className="flex justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {p.productName}{" "}
                                                <span className="text-gray-400">
                                                    ×{p.quantity}
                                                </span>
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(p.totalAmount)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Combos */}
                        {session.combos.length > 0 && (
                            <section>
                                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <Package size={12} /> Combo
                                </h4>
                                <ul className="space-y-1.5">
                                    {session.combos.map((c) => (
                                        <li
                                            key={c.id}
                                            className="flex justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {c.comboName}{" "}
                                                <span className="text-gray-400">
                                                    ×{c.quantity}
                                                </span>
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(c.totalAmount)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Equipment */}
                        {session.equipments.length > 0 && (
                            <section>
                                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <Wrench size={12} /> Thiết bị thuê
                                </h4>
                                <ul className="space-y-1.5">
                                    {session.equipments.map((e) => (
                                        <li
                                            key={e.id}
                                            className="flex justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {e.equipmentName}{" "}
                                                <span className="text-gray-400">
                                                    ×{e.quantity}
                                                </span>
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {e.totalAmount != null
                                                    ? formatCurrency(
                                                          e.totalAmount,
                                                      )
                                                    : "—"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {session.notes && (
                        <p className="mt-3 text-xs italic text-gray-400">
                            Ghi chú: {session.notes}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const SessionHistoryPage: React.FC = () => {
    const { user } = useAuth();
    const { managedBranchId } = useManagedBranch();
    const { branches } = useBranches();

    const isAdmin = user?.role === UserRole.ADMIN;
    const isAdminLike = isAdmin || user?.role === UserRole.MANAGER;

    const [selectedBranchId, setSelectedBranchId] = useState<
        number | undefined
    >(undefined);
    const [selectedDate, setSelectedDate] = useState<string>(
        toInputDate(new Date()),
    );

    const currentBranchId =
        isAdmin && selectedBranchId ? selectedBranchId : managedBranchId;

    const { sessions, isLoading, isError } = useSessionHistory(
        currentBranchId,
        selectedDate,
    );

    const stats = useMemo(() => {
        const completed = sessions.filter(
            (s) => s.status === "COMPLETED",
        ).length;
        const ongoing = sessions.filter((s) => s.status === "ONGOING").length;
        const revenue = sessions
            .filter((s) => s.status === "COMPLETED")
            .reduce((sum, s) => sum + (s.totalAmount ?? 0), 0);
        return { total: sessions.length, completed, ongoing, revenue };
    }, [sessions]);

    return (
        <div className="p-4 md:p-6">
            {/* Page title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Lịch sử phiên chơi
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Xem chi tiết từng phiên chơi trong ngày kèm theo các dịch vụ
                    đã dùng
                </p>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap items-end gap-4">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Ngày
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        max={toInputDate(new Date())}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                {isAdmin && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Chi nhánh
                        </label>
                        <select
                            value={selectedBranchId ?? ""}
                            onChange={(e) =>
                                setSelectedBranchId(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                            <option value="">Chọn chi nhánh</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    {
                        label: "Tổng phiên",
                        value: stats.total,
                        color: "text-gray-900 dark:text-white",
                    },
                    {
                        label: "Đang chơi",
                        value: stats.ongoing,
                        color: "text-blue-600 dark:text-blue-400",
                    },
                    {
                        label: "Hoàn thành",
                        value: stats.completed,
                        color: "text-green-600 dark:text-green-400",
                    },
                    {
                        label: "Doanh thu",
                        value: formatCurrency(stats.revenue),
                        color: "text-orange-600 dark:text-orange-400",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {s.label}
                        </p>
                        <p className={`mt-0.5 text-xl font-bold ${s.color}`}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Session list */}
            {!currentBranchId ? (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-400">
                        {isAdmin
                            ? "Vui lòng chọn chi nhánh để xem lịch sử"
                            : "Đang tải thông tin chi nhánh..."}
                    </p>
                </div>
            ) : isLoading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            ) : isError ? (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-500">
                        Không thể tải dữ liệu. Vui lòng thử lại.
                    </p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-400">
                        Không có phiên chơi nào vào ngày{" "}
                        {formatDisplayDate(selectedDate)}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
};
