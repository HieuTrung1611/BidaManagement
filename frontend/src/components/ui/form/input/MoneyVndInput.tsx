import React from "react";

interface MoneyVndInputProps {
    id?: string;
    name?: string;
    value?: number | null;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
    onValueChange: (value: number | null) => void;
}

const formatVnd = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount);
};

const normalizeDigits = (raw: string): string => {
    return raw.replace(/[^0-9]/g, "");
};

const MoneyVndInput: React.FC<MoneyVndInputProps> = ({
    id,
    name,
    value,
    placeholder,
    disabled = false,
    error = false,
    className = "",
    onValueChange,
}) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    React.useEffect(() => {
        if (value === null || value === undefined) {
            setDisplayValue("");
            return;
        }

        setDisplayValue(formatVnd(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = normalizeDigits(e.target.value);

        if (!digits) {
            setDisplayValue("");
            onValueChange(null);
            return;
        }

        const numericValue = Number(digits);
        setDisplayValue(formatVnd(numericValue));
        onValueChange(numericValue);
    };

    let inputClasses = `h-10 w-full rounded-lg border appearance-none px-4 py-2.5 pr-16 text-sm shadow-theme-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-3 dark:bg-neutral-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    if (disabled) {
        inputClasses +=
            " text-neutral-500 border-neutral-300 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
    } else if (error) {
        inputClasses +=
            " text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500";
    } else {
        inputClasses +=
            " bg-transparent text-neutral-800 border-neutral-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white/90 dark:focus:border-brand-800";
    }

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                VND
            </span>
        </div>
    );
};

export default MoneyVndInput;
