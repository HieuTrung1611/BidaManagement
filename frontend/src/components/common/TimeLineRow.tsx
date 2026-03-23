export const TimelineRow = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div className="relative pl-6">
        <span className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
        <p className="text-sm   tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
    </div>
);
