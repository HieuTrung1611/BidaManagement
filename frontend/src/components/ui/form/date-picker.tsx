import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { Calendar } from "lucide-react";
import { Instance } from "flatpickr/dist/types/instance";

type PropsType = {
    id: string;
    mode?: "single" | "multiple" | "range" | "time";
    onChange?: Hook | Hook[];
    defaultDate?: DateOption;
    label?: string;
    placeholder?: string;
};

export default function DatePicker({
    id,
    mode,
    onChange,
    label,
    defaultDate,
    placeholder,
}: PropsType) {
    const flatpickrInstance = useRef<Instance | null>(null);

    useEffect(() => {
        const flatPickr = flatpickr(`#${id}`, {
            mode: mode || "single",
            static: false,
            monthSelectorType: "static",
            dateFormat: "Y-m-d",
            defaultDate,
            onChange,
            appendTo: document.body,
            disableMobile: true,
            position: "auto",
        });

        flatpickrInstance.current = Array.isArray(flatPickr)
            ? flatPickr[0]
            : flatPickr;

        return () => {
            if (!Array.isArray(flatPickr)) {
                flatPickr.destroy();
            }
        };
    }, [mode, onChange, id]);

    // Update date when defaultDate changes
    useEffect(() => {
        if (flatpickrInstance.current && defaultDate !== undefined) {
            flatpickrInstance.current.setDate(defaultDate, false);
        }
    }, [defaultDate]);

    return (
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <input
                    id={id}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-3  dark:bg-neutral-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-neutral-800 border-neutral-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-neutral-700  dark:focus:border-brand-800"
                />

                <span className="absolute text-neutral-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-neutral-400">
                    <Calendar className="size-6" />
                </span>
            </div>
        </div>
    );
}
