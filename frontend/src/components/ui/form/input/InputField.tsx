import React, { FC, useState, useEffect } from "react";

interface InputProps {
    type?:
        | "text"
        | "number"
        | "email"
        | "password"
        | "date"
        | "time"
        | "money"
        | string;
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    min?: string;
    max?: string;
    step?: number;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string; // Optional hint text
}

const Input: FC<InputProps> = ({
    type = "text",
    id,
    name,
    placeholder,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    className = "",
    min,
    max,
    step,
    disabled = false,
    success = false,
    error = false,
    hint,
}) => {
    // Internal state for display value (used for money type)
    const [displayValue, setDisplayValue] = useState<string>("");

    // Format number with comma separators for money type
    const formatMoney = (num: string | number): string => {
        if (num === "" || num === undefined || num === null) return "";
        const numStr = num.toString().replace(/[^0-9]/g, "");
        if (numStr === "") return "";
        return parseInt(numStr).toLocaleString("en-US");
    };

    // Remove formatting and return clean number
    const parseMoney = (formatted: string): string => {
        return formatted.replace(/[^0-9]/g, "");
    };

    // Initialize display value for money type
    useEffect(() => {
        if (type === "money") {
            if (value !== undefined) {
                setDisplayValue(formatMoney(value));
            } else if (defaultValue !== undefined) {
                setDisplayValue(formatMoney(defaultValue));
            } else {
                setDisplayValue("");
            }
        }
    }, [type, value, defaultValue]);

    // Handle money input change
    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type !== "money" || !onChange) return;

        const inputValue = e.target.value;
        const cleanValue = parseMoney(inputValue);
        const formattedValue = formatMoney(cleanValue);

        // Update internal display state
        setDisplayValue(formattedValue);

        // Create event with clean numeric value for parent component
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                name: e.target.name,
                value: cleanValue,
            },
        };

        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    // Get current display value
    const getCurrentValue = () => {
        if (type === "money") {
            return displayValue;
        }
        return value;
    };
    // Determine input styles based on state (disabled, success, error)
    let inputClasses = `h-10 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-3 dark:bg-neutral-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    // Add styles for the different states
    if (disabled) {
        inputClasses += ` text-neutral-500 border-neutral-300 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700`;
    } else if (error) {
        inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
    } else if (success) {
        inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
    } else {
        inputClasses += ` bg-transparent text-neutral-800 border-neutral-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
        <div className="relative">
            <input
                type={type === "money" ? "text" : type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={type === "money" ? getCurrentValue() : value}
                defaultValue={type === "money" ? undefined : defaultValue}
                onChange={type === "money" ? handleMoneyChange : onChange}
                onKeyDown={onKeyDown}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={inputClasses}
            />

            {/* Optional Hint Text */}
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error
                            ? "text-error-500"
                            : success
                              ? "text-success-500"
                              : "text-neutral-500"
                    }`}>
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;
