"use client";

import React from "react";
import { useBranches } from "@/hooks/useBranch";

const Home = () => {
    const { branches, isLoading } = useBranches();

    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,124,30,0.18),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(255,180,110,0.1),transparent_35%)]" />

            <section
                id="home"
                className="relative border-b border-orange-500/10 px-4 pb-20 pt-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-orange-300/80">
                            Premium Billiards Lounge
                        </p>
                        <h1 className="text-4xl font-bold leading-tight text-orange-100 sm:text-5xl lg:text-6xl [font-family:var(--font-diablo)]">
                            Nâng Tầm Trải Nghiệm Bida
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
                            Không gian thi đấu chuẩn quốc tế, dịch vụ chuyên nghiệp và hệ thống chi nhánh phủ khắp để bạn luôn có
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
                            <div className="h-72 rounded-xl border border-orange-500/15 bg-linear-to-b from-orange-500/15 via-transparent to-black/60 p-4">
                                <div className="h-full rounded-lg border border-dashed border-orange-300/25 bg-black/35" />
                            </div>
                            <p className="mt-4 text-sm text-neutral-400">Ảnh hero để trống, bạn có thể thay bằng ảnh thật sau.</p>
                        </div>

                        <div className="absolute -bottom-4 -left-4 rounded-lg border border-orange-500/20 bg-[#11151b]/95 px-5 py-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-wider text-neutral-400">Mở cửa mỗi ngày</p>
                            <p className="text-2xl font-bold text-orange-300">24/7</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="border-b border-orange-500/10 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-12">
                    <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 lg:col-span-8">
                        <h2 className="text-3xl font-semibold text-orange-100">Sứ Mệnh Của Chúng Tôi</h2>
                        <p className="mt-4 text-sm leading-7 text-neutral-300">
                            Chúng tôi xây dựng hệ sinh thái billiards hiện đại, nơi người chơi mới dễ dàng bắt đầu và cơ thủ chuyên
                            nghiệp có thể luyện tập ở tiêu chuẩn cao nhất. Chất lượng bàn, ánh sáng, dịch vụ và cộng đồng là bốn
                            trụ cột để tạo ra trải nghiệm khác biệt.
                        </p>
                    </div>

                    <div className="grid gap-4 lg:col-span-4">
                        <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                            <p className="text-xs uppercase tracking-wider text-neutral-400">Hoạt động</p>
                            <p className="mt-2 text-4xl font-bold text-orange-300">24/7</p>
                        </div>
                        <div className="rounded-xl border border-orange-500/20 bg-neutral-900/70 p-6 text-center">
                            <p className="text-xs uppercase tracking-wider text-neutral-400">Nhiều chi nhánh</p>
                            <p className="mt-2 text-4xl font-bold text-orange-300">{branches.length}+</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="branches" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Our Locations</p>
                            <h2 className="mt-2 text-3xl font-semibold text-orange-100 sm:text-4xl">Hệ Thống Chi Nhánh</h2>
                        </div>
                        <p className="max-w-md text-sm text-neutral-400">
                            Danh sách chi nhánh được lấy trực tiếp từ API. Ảnh chi nhánh hiện đang để placeholder theo yêu cầu.
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
                                        <h3 className="text-lg font-semibold text-orange-100">{branch.name}</h3>
                                        <p className="line-clamp-2 text-sm text-neutral-400">{branch.address}</p>
                                        <p className="line-clamp-2 text-sm text-neutral-500">{branch.description || "Thông tin mô tả sẽ cập nhật."}</p>
                                        <div className="pt-2 text-xs text-neutral-400">
                                            <p>Quản lý: {branch.managerName || "Đang cập nhật"}</p>
                                            <p>SĐT quản lý: {branch.managerPhoneNumber || "Đang cập nhật"}</p>
                                            <p>Nhân sự: {branch.employeesCount ?? 0}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
