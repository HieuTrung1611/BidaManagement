import React, { useEffect, useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    value?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = "Select an option",
    onChange,
    className = "",
    defaultValue = "",
    value,
}) => {
    // Manage the selected value
    const [selectedValue, setSelectedValue] = useState<string>(
        value !== undefined ? value : defaultValue
    );

    // Sync with external value prop if provided
    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    // Sync with defaultValue when it changes (for uncontrolled mode)
    useEffect(() => {
        if (value === undefined && defaultValue !== selectedValue) {
            setSelectedValue(defaultValue);
        }
    }, [defaultValue, value, selectedValue]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        onChange(value); // Trigger parent handler
    };

    return (
        <select
            className={`h-8 w-fit appearance-none rounded-lg border border-neutral-300  px-2 py-1 text-sm shadow-theme-xs placeholder:text-neutral-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                selectedValue
                    ? "text-neutral-800 dark:text-white/90"
                    : "text-neutral-400 dark:text-neutral-400"
            } ${className}`}
            value={selectedValue}
            onChange={handleChange}>
            {/* Placeholder option - only show when no value selected */}
            {!selectedValue && (
                <option
                    value=""
                    disabled
                    className="text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                    {placeholder}
                </option>
            )}
            {/* Map over options */}
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
