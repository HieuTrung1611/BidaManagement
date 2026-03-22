import Image from "next/image";
import * as React from "react";
import { useTheme } from "@/context/ThemeContext";

type LogoLevelProps = {
    size?: number;
    classname?: string;
};

export default function LogoMHBilliards({
    size = 64,
    classname,
}: LogoLevelProps) {
    const { theme } = useTheme();

    // Chọn logo dựa trên theme: dark theme sử dụng logo white, light theme sử dụng logo black
    const logoSrc =
        theme === "dark"
            ? "/logo/logo_MHBilliards_white.png"
            : "/logo/logo_MHBilliards_black.png";

    return (
        <div className="inline-flex items-center justify-center p-2 rounded-md bg-bgPrimary">
            <Image
                src={logoSrc}
                alt="logo-MHBilliards"
                width={size}
                height={size}
                className={classname}
            />
        </div>
    );
}
