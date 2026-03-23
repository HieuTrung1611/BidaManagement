export const MetaCard = ({
    label,
    value,
    hint,
}: {
    label: string;
    value: React.ReactNode;
    hint?: string;
}) => (
    <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <div className="mt-1 text-base font-medium">{value ?? "--"}</div>
        {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
);
