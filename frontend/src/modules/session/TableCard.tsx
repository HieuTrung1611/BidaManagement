"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Badge from "@/components/ui/badge/Badge";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { Play, Square, Wrench, Clock } from "lucide-react";

interface TableCardProps {
    table: ITableBilliardResponse;
    onStartSession?: (tableId: number) => void;
    onViewSession?: (tableId: number) => void;
    isSelected?: boolean;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case "AVAILABLE":
            return {
                label: "Trống",
                color: "success" as const,
                icon: <Square className="w-4 h-4" />,
                bgColor: "bg-green-50 border-green-200",
            };
        case "IN_USE":
            return {
                label: "Đang chơi",
                color: "warning" as const,
                icon: <Play className="w-4 h-4" />,
                bgColor: "bg-yellow-50 border-yellow-200",
            };
        case "MAINTENANCE":
            return {
                label: "Bảo trì",
                color: "error" as const,
                icon: <Wrench className="w-4 h-4" />,
                bgColor: "bg-red-50 border-red-200",
            };
        case "RESERVED":
            return {
                label: "Đã đặt",
                color: "info" as const,
                icon: <Clock className="w-4 h-4" />,
                bgColor: "bg-blue-50 border-blue-200",
            };
        default:
            return {
                label: status,
                color: "primary" as const,
                icon: null,
                bgColor: "bg-gray-50 border-gray-200",
            };
    }
};

export const TableCard: React.FC<TableCardProps> = ({
    table,
    onStartSession,
    onViewSession,
    isSelected = false,
}) => {
    const statusConfig = getStatusConfig(table.status);

    const handleClick = () => {
        if (table.status === "AVAILABLE" && onStartSession) {
            onStartSession(table.id);
        } else if (table.status === "IN_USE" && onViewSession) {
            onViewSession(table.id);
        }
    };

    return (
        <Card
            className={`transition-all hover:shadow-lg cursor-pointer ${statusConfig.bgColor} ${
                isSelected ? "ring-4 ring-blue-500 shadow-xl scale-105" : ""
            }`}
            onClick={handleClick}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{table.name}</h3>
                    <Badge color={statusConfig.color}>
                        <span className="flex items-center gap-1">
                            {statusConfig.icon}
                            {statusConfig.label}
                        </span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Loại bàn:</span>
                        <span className="font-medium">
                            {table.type?.name || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Giá:</span>
                        <span className="font-medium text-green-600">
                            {table.type?.pricePerHour?.toLocaleString("vi-VN")}{" "}
                            VNĐ/giờ
                        </span>
                    </div>
                </div>
                {table.description && (
                    <p className="text-xs text-gray-500 truncate">
                        {table.description}
                    </p>
                )}
                {isSelected && (
                    <div className="pt-2 text-center">
                        <span className="text-xs font-medium text-blue-600">
                            ✓ Đã chọn
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
