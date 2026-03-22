"use client";
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    ChevronDownIcon,
    CircleUser,
    Columns3Cog,
    Ellipsis,
    IdCardLanyard,
    LayoutGrid,
    SquareRoundCorner,
    Users,
} from "lucide-react";
import ROUTES from "@/constants/routes";
import { useSidebar } from "@/context/SidebarContext";
import LogoMHBilliards from "../common/Logo";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
    {
        icon: <LayoutGrid />,
        name: "Tổng quan",
        path: ROUTES.HOMEADMIN.path,
    },
    {
        icon: <SquareRoundCorner />,
        name: "Quản lý bàn",
        path: ROUTES.TABLEMANAGEMENT.path,
    },
    {
        icon: <IdCardLanyard />,
        name: "Nhân sự",
        subItems: [{ name: "Nhân viên", path: ROUTES.EMPLOYEE.path }],
    },
    {
        icon: <Users />,
        name: "Khách hàng",
        path: "/#", // TODO: Add CUSTOMER route to routes.ts
    },

    {
        icon: <CircleUser />,
        name: "Quản lý tài khoản",
        path: ROUTES.ACCOUNT.path,
    },
    {
        icon: <Building2 />,
        name: "Chi nhánh",
        path: ROUTES.BRANCH.path,
    },
];

const othersItems: NavItem[] = [
    {
        icon: <Columns3Cog />,
        name: "Giao diện",
        path: "/",
    },
];

const Sidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();

    // FIX: Sử dụng useMemo để ngăn biến này bị tạo mới mỗi lần render
    const allPaths = useMemo(() => {
        return [...navItems, ...othersItems]
            .filter((item) => item.path)
            .map((item) => item.path as string)
            .sort((a, b) => b.length - a.length);
    }, []);

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "Quản lý" | "Giao diện";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {},
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Find the best matching path (longest match wins)
    const isActive = useCallback(
        (path: string) => {
            // First check exact match
            if (path === pathname) return true;

            // For sub-pages, only highlight if this is the best (longest) matching path
            if (path !== "/" && pathname.startsWith(path + "/")) {
                // Find if there's a longer path that also matches
                const betterMatch = allPaths.find(
                    (p) =>
                        p !== path &&
                        p.length > path.length &&
                        (pathname === p || pathname.startsWith(p + "/")),
                );
                return !betterMatch; // Only active if no better match exists
            }

            return false;
        },
        [pathname, allPaths],
    );

    // FIX: useEffect này giờ sẽ hoạt động ổn định nhờ allPaths đã được memo
    useEffect(() => {
        let submenuMatched = false;
        ["Quản lý", "Giao diện"].forEach((menuType) => {
            const items = menuType === "Quản lý" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "Quản lý" | "Giao diện",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        // Chỉ đóng submenu nếu URL thay đổi sang trang không thuộc submenu nào
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive]);

    useEffect(() => {
        // Set the height of the submenu items when the submenu is opened
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (
        index: number,
        menuType: "Quản lý" | "Giao diện",
    ) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (
        navItems: NavItem[],
        menuType: "Quản lý" | "Giao diện",
    ) => (
        <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => {
                // Check if any subItem is active
                const hasActiveSubItem = nav.subItems?.some((subItem) =>
                    isActive(subItem.path),
                );
                const isSubmenuOpen =
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index;

                // For menu items without subItems, check if it's active
                // Use isActive to check both exact match and sub-routes
                const isMenuItemActive = nav.path ? isActive(nav.path) : false;

                return (
                    <li key={nav.name}>
                        {nav.subItems ? (
                            <button
                                onClick={() =>
                                    handleSubmenuToggle(index, menuType)
                                }
                                className={`menu-item group  ${
                                    hasActiveSubItem ||
                                    (isSubmenuOpen && !hasActiveSubItem)
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                } cursor-pointer ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "lg:justify-start"
                                }`}>
                                <span
                                    className={` ${
                                        hasActiveSubItem ||
                                        (isSubmenuOpen && !hasActiveSubItem)
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                    }`}>
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span
                                        className={` menu-item-text whitespace-nowrap overflow-hidden text-ellipsis`}>
                                        {nav.name}
                                    </span>
                                )}
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <ChevronDownIcon
                                        className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                                            isSubmenuOpen
                                                ? "rotate-180 text-brand-500"
                                                : ""
                                        }`}
                                    />
                                )}
                            </button>
                        ) : (
                            nav.path && (
                                <Link
                                    href={nav.path}
                                    className={`menu-item group ${
                                        isMenuItemActive
                                            ? "menu-item-active"
                                            : "menu-item-inactive"
                                    }`}>
                                    <span
                                        className={`${
                                            isMenuItemActive
                                                ? "menu-item-icon-active"
                                                : "menu-item-icon-inactive"
                                        }`}>
                                        {nav.icon}
                                    </span>
                                    {(isExpanded ||
                                        isHovered ||
                                        isMobileOpen) && (
                                        <span className={`menu-item-text`}>
                                            {nav.name}
                                        </span>
                                    )}
                                </Link>
                            )
                        )}
                        {nav.subItems &&
                            (isExpanded || isHovered || isMobileOpen) && (
                                <div
                                    ref={(el) => {
                                        subMenuRefs.current[
                                            `${menuType}-${index}`
                                        ] = el;
                                    }}
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        height: isSubmenuOpen
                                            ? `${
                                                  subMenuHeight[
                                                      `${menuType}-${index}`
                                                  ]
                                              }px`
                                            : "0px",
                                    }}>
                                    <ul className="mt-2 space-y-1 ml-9">
                                        {nav.subItems.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.path}
                                                    className={`menu-dropdown-item ${
                                                        isActive(subItem.path)
                                                            ? "menu-dropdown-item-active"
                                                            : "menu-dropdown-item-inactive"
                                                    }`}>
                                                    {subItem.name}
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        {subItem.new && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(
                                                                        subItem.path,
                                                                    )
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge `}>
                                                                new
                                                            </span>
                                                        )}
                                                        {subItem.pro && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(
                                                                        subItem.path,
                                                                    )
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge `}>
                                                                pro
                                                            </span>
                                                        )}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-neutral-900 dark:border-neutral-800 text-neutral-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-neutral-200 
        ${
            isExpanded || isMobileOpen
                ? "w-72.5"
                : isHovered
                  ? "w-72.5"
                  : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div
                className={`py-4 flex  ${
                    !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                }`}>
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <div className="flex items-center z-2 gap-2">
                                <LogoMHBilliards size={32} />
                                <div className="flex flex-col h-full justify-center text-black dark:text-white">
                                    <h1 className="text-2xl font-kkul bold text-nowrap">
                                        MHBilliards
                                    </h1>
                                </div>
                            </div>
                        </>
                    ) : (
                        <LogoMHBilliards size={32} />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-5 text-neutral-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Quản lý"
                                ) : (
                                    <Ellipsis />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "Quản lý")}
                        </div>

                        <div className="">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-5 text-neutral-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Giao diện"
                                ) : (
                                    <Ellipsis />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, "Giao diện")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
