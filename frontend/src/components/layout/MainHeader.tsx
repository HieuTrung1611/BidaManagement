"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
    { id: "home", label: "Trang chủ" },
    { id: "about", label: "Về chúng tôi" },
    { id: "branches", label: "Chi nhánh" },
    { id: "contact", label: "Liên hệ" },
] as const;

const MainHeader: React.FC = () => {
    const [activeSection, setActiveSection] =
        useState<(typeof NAV_ITEMS)[number]["id"]>("home");
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const observerRef = React.useRef<IntersectionObserver | null>(null);

    const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => Boolean(section));

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                // Bỏ qua nếu đang scroll programmatically
                if (isScrolling) {
                    return;
                }

                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleEntries.length > 0) {
                    const newSection = visibleEntries[0].target
                        .id as (typeof NAV_ITEMS)[number]["id"];
                    setActiveSection(newSection);
                }
            },
            {
                root: null,
                rootMargin: "-20% 0px -50% 0px",
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );

        observerRef.current = observer;
        sections.forEach((section) => observer.observe(section));

        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [sectionIds, isScrolling]);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const handleNavClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        sectionId: (typeof NAV_ITEMS)[number]["id"],
    ) => {
        event.preventDefault();

        const section = document.getElementById(sectionId);
        if (!section) {
            return;
        }

        // Clear timeout cũ
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Đặt activeSection ngay lập tức
        setActiveSection(sectionId);
        setIsScrolling(true);

        // Tính toán vị trí
        const headerHeight = 96;
        const targetPosition =
            section.getBoundingClientRect().top + window.scrollY - headerHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 800; // milliseconds
        let startTime: number | null = null;

        // Easing function cho smooth scroll
        const easeInOutCubic = (t: number): number => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        // Animation function
        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                // Scroll hoàn thành
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false);
                }, 100);
            }
        };

        requestAnimationFrame(animation);

        // Cập nhật URL
        window.history.pushState(null, "", `#${sectionId}`);
    };

    return (
        <header
            className="sticky top-0 z-40 border-b border-orange-500/20 bg-black/70 backdrop-blur-xl will-change-transform"
            style={{ transform: "translateZ(0)" }}>
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-wide text-orange-300">
                    MHBilliards
                </Link>

                <nav className="hidden items-center gap-7 text-sm md:flex">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(event) =>
                                    handleNavClick(event, item.id)
                                }
                                className={`relative pb-1 transition-colors duration-300 ${
                                    isActive
                                        ? "text-orange-300"
                                        : "text-neutral-300 hover:text-orange-200"
                                }`}>
                                {item.label}
                                <span
                                    className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-linear-to-r from-orange-300 via-orange-400 to-orange-500 shadow-[0_0_12px_rgba(251,146,60,0.85)] transition-transform duration-300 ease-out will-change-transform ${
                                        isActive ? "scale-x-100" : "scale-x-0"
                                    }`}
                                    style={{ transform: "translateZ(0)" }}
                                />
                            </a>
                        );
                    })}
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
