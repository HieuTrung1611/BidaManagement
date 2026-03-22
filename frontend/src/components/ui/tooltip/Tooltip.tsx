"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface TooltipProps {
    children: React.ReactElement;
    content: React.ReactNode;
    placement?: "top" | "right" | "bottom" | "left";
    delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    placement = "top",
    delayDuration = 200,
}) => {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={placement}
                        className="z-50 overflow-hidden rounded-md bg-neutral-900 dark:bg-neutral-50 px-3 py-1.5 text-xs text-white dark:text-neutral-900 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        sideOffset={5}>
                        {content}
                        <TooltipPrimitive.Arrow className="fill-neutral-900 dark:fill-neutral-50" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};

export default Tooltip;
