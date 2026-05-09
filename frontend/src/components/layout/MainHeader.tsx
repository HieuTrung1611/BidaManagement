import Link from "next/link";
import React from "react";

const MainHeader: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 border-b border-orange-500/20 bg-black/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-lg font-bold tracking-wide text-orange-300">
                    QUEUES & CUES
                </Link>

                <nav className="hidden items-center gap-7 text-sm text-neutral-300 md:flex">
                    <a href="#home" className="transition-colors hover:text-orange-300">
                        Home
                    </a>
                    <a href="#about" className="transition-colors hover:text-orange-300">
                        About
                    </a>
                    <a href="#branches" className="transition-colors hover:text-orange-300">
                        Chi nhánh
                    </a>
                    <a href="#contact" className="transition-colors hover:text-orange-300">
                        Liên hệ
                    </a>
                </nav>

                <Link
                    href="/login"
                    className="rounded-md border border-orange-400/70 bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400">
                    Đăng nhập
                </Link>
            </div>
        </header>
    );
};

export default MainHeader;