import React, { ReactNode } from "react";
import Tooltip from "../tooltip/Tooltip";

interface ButtonProps {
    children?: ReactNode; // Button text or content
    type?: "button" | "submit" | "reset" | undefined;
    size?: "sm" | "md" | "icon"; // Button size
    variant?: "primary" | "outline" | "danger"; // Button variant
    startIcon?: ReactNode; // Icon before the text
    endIcon?: ReactNode; // Icon after the text
    onClick?: () => void; // Click handler
    disabled?: boolean; // Disabled state
    className?: string; // Additional classes
    tooltip?: string; // Tooltip text
    tooltipPlacement?: "top" | "right" | "bottom" | "left"; // Tooltip placement
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = "button",
    size = "sm",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
    tooltip,
    tooltipPlacement = "top",
}) => {
    // Size Classes
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-3.5 text-sm",
        icon: "p-2.5",
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
        danger: "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
        outline:
            "bg-white text-neutral-700 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700 dark:hover:bg-white/[0.03] dark:hover:text-neutral-300",
    };

    const button = (
        <button
            className={`inline-flex items-center justify-center font-medium gap-2 rounded-md transition ${className} ${
                sizeClasses[size]
            } ${variantClasses[variant]} ${
                disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={onClick}
            disabled={disabled}
            type={type}>
            {startIcon && (
                <span className="flex items-center">{startIcon}</span>
            )}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );

    if (tooltip) {
        return (
            <Tooltip content={tooltip} placement={tooltipPlacement}>
                {button}
            </Tooltip>
        );
    }

    return button;
};

export default Button;
