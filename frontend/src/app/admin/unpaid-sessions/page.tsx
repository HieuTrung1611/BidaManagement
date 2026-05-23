"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import sessionService from "@/services/sessionService";
import { IBilliardSessionResponse } from "@/types/session";
import { Phone, Calendar, DollarSign, User, Table } from "lucide-react";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default function UnpaidSessionsPage() {
    const { showToast } = useToast();
    const managedBranchId = useManagedBranch();
    const [sessions, setSessions] = useState<IBilliardSessionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (managedBranchId) {
            loadUnpaidSessions();
        }
    }, [managedBranchId]);

    const loadUnpaidSessions = async () => {
        if (!managedBranchId) return;

        setIsLoading(true);
        try {
            const response =
                await sessionService.getUnpaidSessions(managedBranchId);
            setSessions(response.data || []);
        } catch (error: any) {
            console.error("Error loading unpaid sessions:", error);
            showToast(
                error.response?.data?.message ||
                    "Không thể tải danh sách session chưa thanh toán",
                "error",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentStatusBadge = (status?: string) => {
        switch (status) {
            case "DEBT":
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Nợ - Cần liên hệ
                    </span>
                );
            case "UNPAID":
                return (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        Chưa thanh toán
                    </span>
                );
            case "PENDING":
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Đang chờ thanh toán
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    📋 Sessions Chưa Thanh Toán
                </h1>
                <Button onClick={loadUnpaidSessions} disabled={isLoading}>
                    {isLoading ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            {isLoading && sessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    Đang tải...
                </div>
            ) : sessions.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12 text-muted-foreground">
                        Không có session chưa thanh toán
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                        <Card
                            key={session.id}
                            className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Table className="h-5 w-5 text-blue-500" />
                                        {session.tableName}
                                    </CardTitle>
                                    {getPaymentStatusBadge(
                                        session.paymentStatus,
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {session.customerName}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a
                                        href={`tel:${session.customerPhoneForDebt || session.customerPhone}`}
                                        className="text-blue-600 hover:underline">
                                        {session.customerPhoneForDebt ||
                                            session.customerPhone}
                                    </a>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {session.endTime
                                            ? format(
                                                  new Date(session.endTime),
                                                  "dd/MM/yyyy HH:mm",
                                              )
                                            : "Chưa kết thúc"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-bold text-lg text-red-600">
                                        {formatCurrency(session.totalAmount)}
                                    </span>
                                </div>

                                {session.notes && (
                                    <div className="text-sm text-muted-foreground border-t pt-2">
                                        <span className="font-medium">
                                            Ghi chú:
                                        </span>{" "}
                                        {session.notes}
                                    </div>
                                )}

                                {session.isSelfService && (
                                    <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                        🤖 Tự phục vụ
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
