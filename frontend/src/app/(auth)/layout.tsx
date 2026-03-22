import LogoMHBilliards from "@/components/common/Logo";
import ToogleThemButtonOne from "@/components/common/ToggleThemeButtonOne";
import { ThemeProvider } from "@/context/ThemeContext";
import React, { ReactNode } from "react";

const LayoutAuth = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative bg-bgPrimary dark:bg-neutral-900">
            <ThemeProvider>
                <div
                    className="relative flex w-full h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url(/background/login-bg.png)",
                    }}>
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Theme toggle in top right */}
                    <div className="fixed top-6 right-6 z-10">
                        <ToogleThemButtonOne />
                    </div>

                    {/* Centered form */}
                    <div className="relative z-10 w-full max-w-md mx-auto">
                        {children}
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
};

export default LayoutAuth;
