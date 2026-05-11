"use client";

import React from "react";
import Image from "next/image";
import { useBranches } from "@/hooks/useBranch";

const Home = () => {
    const { branches, isLoading } = useBranches();

    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,124,30,0.18),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(255,180,110,0.1),transparent_35%)]" />

            <section
                id="home"
                className="relative flex min-h-screen items-center border-b border-orange-500/10 px-4 pb-20 pt-18 scroll-mt-28 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-orange-300/80">
                            Premium Billiards Lounge
                        </p>
                        <h1 className="text-4xl font-bold leading-tight text-orange-100 sm:text-5xl lg:text-6xl [font-family:var(--font-diablo)]">
                            Nâng Tầm Trải Nghiệm Bida
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
                            Không gian thi đấu chuẩn quốc tế, dịch vụ chuyên
                            nghiệp và hệ thống chi nhánh phủ khắp để bạn luôn có
                            một bàn đấu đỉnh cao gần nhất.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#branches"
                                className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400">
                                Xem chi nhánh
                            </a>
                            <a
                                href="#about"
                                className="rounded-md border border-orange-400/50 px-6 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/10">
                                Về chúng tôi
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl border border-orange-400/20 bg-[linear-gradient(145deg,#1b120d,#0a0f14_55%)] p-6 shadow-[0_0_90px_-35px_rgba(255,126,43,0.55)]">
                            <div className="relative h-72 rounded-xl border border-orange-500/15 overflow-hidden">
                                <Image
                                    src="/image/main.png"
                                    alt="MHBilliards - Hệ thống CLB Billiards quy mô lớn nhất Việt Nam"
                                    fill
                                    className="object-cover rounded-lg"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 rounded-lg border border-orange-500/20 bg-[#11151b]/95 px-5 py-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                Mở cửa mỗi ngày
                            </p>
                            <p className="text-2xl font-bold text-orange-300">
                                24/7
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="about"
                className="flex min-h-screen items-center border-b border-orange-500/10 px-4 py-20 scroll-mt-28 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">
                            About Us
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-orange-100 sm:text-4xl">
                            Về MHBilliards
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
                            Hệ thống CLB Billiards quy mô lớn và chuyên nghiệp
                            nhất Việt Nam
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Sứ mệnh - Left side */}
                        <div className="space-y-6 lg:col-span-8">
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <h3 className="text-xl font-semibold text-orange-100">
                                    Sứ Mệnh Của Chúng Tôi
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-neutral-300">
                                    Chúng tôi xây dựng hệ sinh thái billiards
                                    hiện đại, nơi người chơi mới dễ dàng bắt đầu
                                    và cơ thủ chuyên nghiệp có thể luyện tập ở
                                    tiêu chuẩn cao nhất. Chất lượng bàn, ánh
                                    sáng, dịch vụ và cộng đồng là bốn trụ cột để
                                    tạo ra trải nghiệm khác biệt.
                                </p>
                                <p className="mt-3 text-sm leading-7 text-neutral-300">
                                    Với đội ngũ huấn luyện viên giàu kinh nghiệm
                                    và trang thiết bị đạt chuẩn thi đấu quốc tế,
                                    chúng tôi cam kết mang đến không gian chơi
                                    billiards đẳng cấp, chuyên nghiệp và thân
                                    thiện nhất tại Việt Nam.
                                </p>
                            </div>

                            {/* Core Values */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-orange-500/10 p-2">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-orange-200">
                                                Chất Lượng Chuẩn Quốc Tế
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                                Bàn billiards nhập khẩu chính
                                                hãng, bảo dưỡng định kỳ
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-orange-500/10 p-2">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-orange-200">
                                                Đội Ngũ Chuyên Nghiệp
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                                Nhân viên được đào tạo bài bản,
                                                phục vụ tận tâm
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-orange-500/10 p-2">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-orange-200">
                                                Vị Trí Thuận Lợi
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                                Chi nhánh trải khắp các quận
                                                huyện, dễ dàng di chuyển
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-orange-500/10 p-2">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-orange-200">
                                                Mở Cửa 24/7
                                            </h4>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                                Phục vụ linh hoạt mọi khung giờ,
                                                kể cả ngày lễ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats - Right side */}
                        <div className="grid gap-4 lg:col-span-4">
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Số chi nhánh
                                </p>
                                <p className="mt-2 text-4xl font-bold text-orange-300">
                                    {branches.length}+
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Trên toàn quốc
                                </p>
                            </div>

                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Số bàn
                                </p>
                                <p className="mt-2 text-4xl font-bold text-orange-300">
                                    500+
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Bàn billiards chuyên nghiệp
                                </p>
                            </div>

                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Khách hàng
                                </p>
                                <p className="mt-2 text-4xl font-bold text-orange-300">
                                    50K+
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Thành viên thân thiết
                                </p>
                            </div>

                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Kinh nghiệm
                                </p>
                                <p className="mt-2 text-4xl font-bold text-orange-300">
                                    10+
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Năm hoạt động
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Timeline */}
                    <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                        <h3 className="text-lg font-semibold text-orange-100">
                            Thành Tựu Nổi Bật
                        </h3>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-orange-500/20 p-1.5">
                                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-orange-200">
                                        2023
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                        Top 3 chuỗi CLB Billiards uy tín nhất
                                        Việt Nam
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-orange-500/20 p-1.5">
                                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-orange-200">
                                        2024
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                        Tổ chức thành công 15+ giải đấu lớn
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-orange-500/20 p-1.5">
                                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-orange-200">
                                        2025
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                                        Mở rộng ra 20+ chi nhánh trên toàn quốc
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="branches"
                className="flex min-h-screen items-center border-b border-orange-500/10 px-4 py-20 scroll-mt-28 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">
                                Our Locations
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-orange-100 sm:text-4xl">
                                Hệ Thống Chi Nhánh
                            </h2>
                        </div>
                        <p className="max-w-md text-sm text-neutral-400">
                            Danh sách chi nhánh được lấy trực tiếp từ API. Ảnh
                            chi nhánh hiện đang để placeholder theo yêu cầu.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-xl border border-orange-500/15 bg-neutral-900/70 p-4">
                                    <div className="h-44 rounded-lg bg-neutral-800/80" />
                                    <div className="mt-4 h-4 w-2/3 rounded bg-neutral-800/80" />
                                    <div className="mt-2 h-3 w-full rounded bg-neutral-800/70" />
                                </div>
                            ))}
                        </div>
                    ) : branches.length === 0 ? (
                        <div className="rounded-xl border border-orange-500/15 bg-neutral-900/70 p-10 text-center text-neutral-400">
                            Chưa có dữ liệu chi nhánh.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {branches.map((branch) => (
                                <article
                                    key={branch.id}
                                    className="group overflow-hidden rounded-xl border border-orange-500/15 bg-neutral-900/80 transition duration-300 hover:-translate-y-1 hover:border-orange-400/50">
                                    <div className="h-44 border-b border-orange-500/10 bg-[linear-gradient(145deg,rgba(255,122,36,0.15),rgba(15,19,23,0.92))] p-4">
                                        {branch.branchImages?.[0]?.url ? (
                                            <img
                                                src={branch.branchImages[0].url}
                                                alt={branch.name}
                                                className="h-full w-full rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-orange-300/25 text-xs uppercase tracking-[0.2em] text-orange-200/60">
                                                Ảnh Chi Nhánh
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 p-5">
                                        <h3 className="text-lg font-semibold text-orange-100">
                                            {branch.name}
                                        </h3>
                                        <p className="line-clamp-2 text-sm text-neutral-400">
                                            {branch.address}
                                        </p>
                                        <p className="line-clamp-2 text-sm text-neutral-500">
                                            {branch.description ||
                                                "Thông tin mô tả sẽ cập nhật."}
                                        </p>
                                        <div className="pt-2 text-xs text-neutral-400">
                                            <p>
                                                Quản lý:{" "}
                                                {branch.managerName ||
                                                    "Đang cập nhật"}
                                            </p>
                                            <p>
                                                SĐT quản lý:{" "}
                                                {branch.managerPhoneNumber ||
                                                    "Đang cập nhật"}
                                            </p>
                                            <p>
                                                Nhân sự:{" "}
                                                {branch.employeesCount ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section
                id="contact"
                className="flex min-h-screen items-center px-4 py-20 scroll-mt-28 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">
                            Get In Touch
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-orange-100 sm:text-4xl">
                            Liên Hệ Với Chúng Tôi
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
                            Đặt bàn nhanh, tư vấn gói dịch vụ hoặc hợp tác tổ
                            chức giải đấu. Đội ngũ MHBilliards luôn sẵn sàng hỗ
                            trợ bạn mọi khung giờ.
                        </p>
                    </div>

                    {/* Main Contact Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Contact Methods */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <h3 className="text-lg font-semibold text-orange-100">
                                    Thông Tin Liên Hệ
                                </h3>
                                <div className="mt-4 space-y-4">
                                    {/* Hotline */}
                                    <div className="flex items-start gap-4 rounded-lg border border-orange-500/10 bg-black/20 p-4">
                                        <div className="rounded-lg bg-orange-500/10 p-2.5">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Hotline 24/7
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-orange-200">
                                                1900 0000
                                            </p>
                                            <p className="mt-1 text-xs text-neutral-500">
                                                Tư vấn và đặt bàn nhanh chóng
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4 rounded-lg border border-orange-500/10 bg-black/20 p-4">
                                        <div className="rounded-lg bg-orange-500/10 p-2.5">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Email
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-orange-200">
                                                mhbilliards@gmail.vn
                                            </p>
                                            <p className="mt-1 text-xs text-neutral-500">
                                                Phản hồi trong vòng 24h
                                            </p>
                                        </div>
                                    </div>

                                    {/* Social */}
                                    <div className="flex items-start gap-4 rounded-lg border border-orange-500/10 bg-black/20 p-4">
                                        <div className="rounded-lg bg-orange-500/10 p-2.5">
                                            <svg
                                                className="h-5 w-5 text-orange-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                                Mạng xã hội
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-200 transition hover:bg-orange-500/20">
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                    Facebook
                                                </a>
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-200 transition hover:bg-orange-500/20">
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                                        <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                    </svg>
                                                    Instagram
                                                </a>
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-200 transition hover:bg-orange-500/20">
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                    </svg>
                                                    TikTok
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <h3 className="text-lg font-semibold text-orange-100">
                                    Giờ Hoạt Động
                                </h3>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between rounded-lg border border-orange-500/10 bg-black/20 px-4 py-2.5">
                                        <span className="text-sm text-neutral-300">
                                            Thứ 2 - Thứ 6
                                        </span>
                                        <span className="text-sm font-semibold text-orange-200">
                                            24/7
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-orange-500/10 bg-black/20 px-4 py-2.5">
                                        <span className="text-sm text-neutral-300">
                                            Thứ 7 - Chủ Nhật
                                        </span>
                                        <span className="text-sm font-semibold text-orange-200">
                                            24/7
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-orange-500/10 bg-black/20 px-4 py-2.5">
                                        <span className="text-sm text-neutral-300">
                                            Ngày Lễ, Tết
                                        </span>
                                        <span className="text-sm font-semibold text-orange-200">
                                            24/7
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs text-neutral-500">
                                        * Tất cả các chi nhánh đều phục vụ liên
                                        tục không nghỉ
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4">
                            {/* Office Address */}
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-500/10 p-2">
                                        <svg
                                            className="h-5 w-5 text-orange-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-orange-200">
                                            Văn Phòng Điều Hành
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                                            88 Nguyễn Huệ, Quận 1,
                                            <br />
                                            TP. Hồ Chí Minh
                                        </p>
                                        <p className="mt-2 text-xs text-neutral-500">
                                            Thứ 2 - Thứ 6: 8:00 - 17:00
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Corporate Support */}
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-500/10 p-2">
                                        <svg
                                            className="h-5 w-5 text-orange-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-orange-200">
                                            Hợp Tác Doanh Nghiệp
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                                            Tổ chức sự kiện, team building, giải
                                            đấu cho đối tác doanh nghiệp
                                        </p>
                                        <p className="mt-2 text-xs font-medium text-orange-300">
                                            partner@mhbilliards.vn
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Franchise */}
                            <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-orange-500/10 p-2">
                                        <svg
                                            className="h-5 w-5 text-orange-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-orange-200">
                                            Nhượng Quyền
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                                            Cơ hội đầu tư và phát triển chuỗi
                                            CLB billiards hàng đầu
                                        </p>
                                        <p className="mt-2 text-xs font-medium text-orange-300">
                                            franchise@mhbilliards.vn
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6">
                                <h3 className="text-sm font-semibold text-orange-200">
                                    Câu Hỏi Thường Gặp?
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                                    Xem danh sách các câu hỏi và giải đáp phổ
                                    biến
                                </p>
                                <a
                                    href="#"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-300 transition hover:text-orange-200">
                                    Xem FAQ
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact Form Teaser */}
                    <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div>
                                <h3 className="text-lg font-semibold text-orange-100">
                                    Bạn Cần Hỗ Trợ Nhanh?
                                </h3>
                                <p className="mt-1 text-sm text-neutral-400">
                                    Để lại thông tin, chúng tôi sẽ liên hệ lại
                                    trong 15 phút
                                </p>
                            </div>
                            <a
                                href="#"
                                className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400">
                                Đăng ký tư vấn
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
