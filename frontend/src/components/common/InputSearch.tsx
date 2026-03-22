"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface InputSearchProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceTime?: number;
    className?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
    value = "",
    onChange,
    placeholder = "Nhập từ khóa tìm kiếm...",
    debounceTime = 700,
    className = "",
}) => {
    const [localValue, setLocalValue] = useState(value);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, debounceTime);

        return () => {
            clearTimeout(timer);
        };
    }, [localValue, debounceTime, onChange]);

    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange("");
    }, [onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="h-4 w-4" />
            </div>
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-md border border-neutral-300 bg-white px-10 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-300 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400"
            />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    type="button"
                    aria-label="Clear search">
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default InputSearch;
