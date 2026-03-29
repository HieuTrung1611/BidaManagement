import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    separator?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    className = "",
    separator = "/",
}) => {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {items.map((item, index) => (
                    <li
                        key={`${item.label}-${index}`}
                        className="flex items-center gap-2">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="transition-colors hover:text-foreground">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-foreground">
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && <span>{separator}</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
