import React from "react";
import { cn } from "@/lib/utils";

interface DetailFieldProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    iconSize?: number;
    iconClassName?: string;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

const DetailField: React.FC<DetailFieldProps> = ({
    label,
    value,
    icon,
    iconSize = 16,
    iconClassName,
    className,
    labelClassName,
    valueClassName,
}) => {
    return (
        <div className={cn("grid gap-1.5", className)}>
            <div
                className={cn(
                    "flex items-center gap-2 text-sm font-medium text-muted-foreground",
                    labelClassName,
                )}>
                {icon && (
                    <span
                        className={cn(
                            "inline-flex shrink-0 [&_svg]:h-full [&_svg]:w-full",
                            iconClassName,
                        )}
                        style={{ width: iconSize, height: iconSize }}>
                        {icon}
                    </span>
                )}
                {label}
            </div>
            <div
                className={cn(
                    "flex items-center gap-2 text-sm font-medium text-foreground",
                    valueClassName,
                )}>
                <span>{value}</span>
            </div>
        </div>
    );
};

export default DetailField;
