"use client";
import { useTitle } from "@/context/TitleContext";
import React, { useCallback, useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import statisticsService, {
    DashboardOverview,
    RevenueStatistics,
    SalaryStatistics,
} from "@/services/statisticsService";
import branchService from "@/services/branchService";
import { IBranchResponse } from "@/types/branch";

// ============================================================
// Formatting helpers
// ============================================================
const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);

const formatCompact = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return String(value);
};

// ============================================================
// KPI Card
// ============================================================
interface KPICardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; label: string };
}

const KPICard = ({ title, value, subtitle, icon, color, trend }: KPICardProps) => (
    <div className="kpi-card">
        <div className="kpi-card__header">
            <span className="kpi-card__title">{title}</span>
            <div className="kpi-card__icon" style={{ background: color }}>
                {icon}
            </div>
        </div>
        <div className="kpi-card__value">{value}</div>
        {subtitle && <div className="kpi-card__subtitle">{subtitle}</div>}
        {trend && (
            <div
                className="kpi-card__trend"
                style={{ color: trend.value >= 0 ? "#22c55e" : "#ef4444" }}
            >
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </div>
        )}
    </div>
);

// ============================================================
// Custom Tooltip for charts
// ============================================================
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip__label">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.name}: {formatVND(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ============================================================
// Period selector tabs
// ============================================================
type RevenuePeriod = "monthly" | "yearly" | "weekly";

const PERIOD_LABELS: Record<RevenuePeriod, string> = {
    monthly: "Theo tháng",
    yearly: "Theo năm",
    weekly: "Theo tuần",
};

// ============================================================
// Main Dashboard component
// ============================================================
const AdminHome = () => {
    const { setTitle } = useTitle();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [branches, setBranches] = useState<IBranchResponse[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined);
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("yearly");
    const [revenueStats, setRevenueStats] = useState<RevenueStatistics | null>(null);
    const [salaryStats, setSalaryStats] = useState<SalaryStatistics | null>(null);
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [loading, setLoading] = useState(true);
    const [revenueLoading, setRevenueLoading] = useState(false);

    useEffect(() => {
        setTitle("Tổng quan hệ thống");
    }, [setTitle]);

    // Load branches
    useEffect(() => {
        branchService.getAllBranch().then((res) => {
            if (res?.data) setBranches(res.data);
        });
    }, []);

    // Load overview
    useEffect(() => {
        setLoading(true);
        statisticsService
            .getDashboardOverview(selectedBranchId)
            .then((res) => {
                if (res?.data) setOverview(res.data);
            })
            .finally(() => setLoading(false));
    }, [selectedBranchId]);

    // Load revenue stats
    const loadRevenue = useCallback(async () => {
        setRevenueLoading(true);
        try {
            let res;
            if (revenuePeriod === "monthly") {
                res = await statisticsService.getMonthlyRevenue(year, month, selectedBranchId);
            } else if (revenuePeriod === "yearly") {
                res = await statisticsService.getYearlyRevenue(year, selectedBranchId);
            } else {
                res = await statisticsService.getWeeklyRevenue(year, selectedBranchId);
            }
            if (res?.data) setRevenueStats(res.data);
        } finally {
            setRevenueLoading(false);
        }
    }, [revenuePeriod, year, month, selectedBranchId]);

    useEffect(() => {
        loadRevenue();
    }, [loadRevenue]);

    // Load salary stats
    useEffect(() => {
        statisticsService.getYearlySalaryStats(year, selectedBranchId).then((res) => {
            if (res?.data) setSalaryStats(res.data);
        });
    }, [year, selectedBranchId]);

    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="dashboard">
            <style>{`
                .dashboard {
                    padding: 28px 0;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    color: #1e293b;
                }

                /* Top bar */
                .dashboard__topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .dashboard__greeting {
                    font-size: 22px;
                    font-weight: 800;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .dashboard__greeting-sub {
                    font-size: 13px;
                    color: #94a3b8;
                    margin-top: 4px;
                }
                .dashboard__controls {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    align-items: center;
                }
                .dashboard__select {
                    background: white;
                    border: 1.5px solid #e2e8f0;
                    color: #374151;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }
                .dashboard__select:hover, .dashboard__select:focus {
                    border-color: #FF6B00;
                    box-shadow: 0 0 0 3px rgba(255,107,0,0.1);
                }

                /* KPI Grid */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 18px;
                    margin-bottom: 28px;
                }
                .kpi-card {
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 22px 22px 18px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03);
                }
                .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
                .kpi-card--orange::before { background: linear-gradient(90deg, #FF6B00, #ff8c42); }
                .kpi-card--blue::before   { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
                .kpi-card--green::before  { background: linear-gradient(90deg, #10b981, #34d399); }
                .kpi-card--amber::before  { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
                .kpi-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }
                .kpi-card__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 14px;
                }
                .kpi-card__title {
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .kpi-card__icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .kpi-card__value {
                    font-size: 28px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                    margin-bottom: 6px;
                }
                .kpi-card__subtitle {
                    font-size: 12px;
                    color: #94a3b8;
                }
                .kpi-card__trend {
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 8px;
                }

                /* Charts grid */
                .charts-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 18px;
                    margin-bottom: 28px;
                }
                @media (max-width: 900px) {
                    .charts-grid { grid-template-columns: 1fr; }
                }
                .chart-card {
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03);
                }
                .chart-card__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .chart-card__title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .chart-card__subtitle {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 2px;
                }

                /* Period tabs */
                .period-tabs {
                    display: flex;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 3px;
                    gap: 2px;
                }
                .period-tab {
                    padding: 5px 12px;
                    border-radius: 7px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .period-tab.active {
                    background: #FF6B00;
                    color: white;
                    box-shadow: 0 2px 8px rgba(255,107,0,0.3);
                }
                .period-tab:hover:not(.active) {
                    color: #374151;
                    background: #e2e8f0;
                }

                /* Tooltip */
                .chart-tooltip {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-size: 13px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .chart-tooltip__label {
                    color: #64748b;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                /* Revenue summary */
                .revenue-summary {
                    display: flex;
                    gap: 24px;
                    margin-bottom: 18px;
                    flex-wrap: wrap;
                }
                .revenue-summary__item {
                    text-align: center;
                }
                .revenue-summary__label {
                    font-size: 11px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    font-weight: 600;
                }
                .revenue-summary__value {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-top: 2px;
                }

                /* Salary grid */
                .salary-charts-grid {
                    display: grid;
                    grid-template-columns: 3fr 1fr;
                    gap: 18px;
                    margin-bottom: 28px;
                }
                @media (max-width: 900px) {
                    .salary-charts-grid { grid-template-columns: 1fr; }
                }

                /* Quick stat row */
                .quick-stat-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 14px;
                    background: #f8fafc;
                    border-radius: 10px;
                    border: 1px solid #f1f5f9;
                    transition: background 0.15s;
                }
                .quick-stat-row:hover {
                    background: #fff7f0;
                    border-color: #fed7aa;
                }

                /* Loading skeleton */
                .skeleton {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: skeleton-wave 1.5s infinite;
                    border-radius: 10px;
                }
                @keyframes skeleton-wave {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {/* Top Bar */}
            <div className="dashboard__topbar">
                <div>
                    <div className="dashboard__greeting">
                        <span style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #FF6B00, #ff8c42)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, flexShrink: 0
                        }}>📊</span>
                        Tổng quan hệ thống
                    </div>
                    <div className="dashboard__greeting-sub">
                        Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                    </div>
                </div>
                <div className="dashboard__controls">
                    <select
                        className="dashboard__select"
                        value={selectedBranchId ?? ""}
                        onChange={(e) =>
                            setSelectedBranchId(e.target.value ? Number(e.target.value) : undefined)
                        }
                    >
                        <option value="">🏢 Tất cả chi nhánh</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="dashboard__select"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                Năm {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card kpi-card--orange">
                    <div className="kpi-card__header">
                        <span className="kpi-card__title">Doanh thu hôm nay</span>
                        <div className="kpi-card__icon" style={{ background: "rgba(255,107,0,0.1)" }}>💰</div>
                    </div>
                    <div className="kpi-card__value" style={{ color: "#FF6B00" }}>
                        {loading ? <div className="skeleton" style={{ height: 32, width: 120 }} /> : formatVND(overview?.revenueToday ?? 0)}
                    </div>
                    <div className="kpi-card__subtitle">Tổng hóa đơn đã thanh toán</div>
                </div>

                <div className="kpi-card kpi-card--blue">
                    <div className="kpi-card__header">
                        <span className="kpi-card__title">Doanh thu tháng này</span>
                        <div className="kpi-card__icon" style={{ background: "rgba(59,130,246,0.1)" }}>📈</div>
                    </div>
                    <div className="kpi-card__value" style={{ color: "#3b82f6" }}>
                        {loading ? <div className="skeleton" style={{ height: 32, width: 100 }} /> : formatCompact(overview?.revenueThisMonth ?? 0) + "đ"}
                    </div>
                    <div className="kpi-card__subtitle">Tháng {currentMonth}/{currentYear}</div>
                </div>

                <div className="kpi-card kpi-card--green">
                    <div className="kpi-card__header">
                        <span className="kpi-card__title">Số phiên hôm nay</span>
                        <div className="kpi-card__icon" style={{ background: "rgba(16,185,129,0.1)" }}>🎱</div>
                    </div>
                    <div className="kpi-card__value" style={{ color: "#10b981" }}>
                        {loading ? <div className="skeleton" style={{ height: 32, width: 60 }} /> : String(overview?.sessionsToday ?? 0)}
                    </div>
                    <div className="kpi-card__subtitle">Phiên chơi đã hoàn thành</div>
                </div>

                <div className="kpi-card kpi-card--amber">
                    <div className="kpi-card__header">
                        <span className="kpi-card__title">Bàn đang hoạt động</span>
                        <div className="kpi-card__icon" style={{ background: "rgba(245,158,11,0.1)" }}>🟢</div>
                    </div>
                    <div className="kpi-card__value" style={{ color: "#f59e0b" }}>
                        {loading ? <div className="skeleton" style={{ height: 32, width: 60 }} /> : String(overview?.activeTablesNow ?? 0)}
                    </div>
                    <div className="kpi-card__subtitle">Đang có khách chơi</div>
                </div>
            </div>

            {/* Revenue Chart + Mini Stats */}
            <div className="charts-grid">
                {/* Main Revenue Chart */}
                <div className="chart-card">
                    <div className="chart-card__header">
                        <div>
                            <div className="chart-card__title">Biểu đồ doanh thu</div>
                            <div className="chart-card__subtitle">
                                {revenueStats?.periodLabel ?? ""}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            {revenuePeriod === "monthly" && (
                                <select
                                    className="dashboard__select"
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>
                                            Tháng {m}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div className="period-tabs">
                                {(Object.keys(PERIOD_LABELS) as RevenuePeriod[]).map((p) => (
                                    <button
                                        key={p}
                                        className={`period-tab${revenuePeriod === p ? " active" : ""}`}
                                        onClick={() => setRevenuePeriod(p)}
                                    >
                                        {PERIOD_LABELS[p]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary row */}
                    <div className="revenue-summary">
                        <div className="revenue-summary__item">
                            <div className="revenue-summary__label">Tổng doanh thu</div>
                            <div className="revenue-summary__value" style={{ color: "#FF6B00" }}>
                                {formatVND(revenueStats?.totalRevenue ?? 0)}
                            </div>
                        </div>
                        <div className="revenue-summary__item">
                            <div className="revenue-summary__label">Số hóa đơn</div>
                            <div className="revenue-summary__value" style={{ color: "#3b82f6" }}>
                                {revenueStats?.totalInvoices ?? 0}
                            </div>
                        </div>
                        <div className="revenue-summary__item">
                            <div className="revenue-summary__label">Trung bình / phiên</div>
                            <div className="revenue-summary__value" style={{ color: "#10b981" }}>
                                {formatVND(revenueStats?.averagePerSession ?? 0)}
                            </div>
                        </div>
                    </div>

                    {revenueLoading ? (
                        <div className="skeleton" style={{ height: 280 }} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenueStats?.chartData ?? []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    axisLine={{ stroke: "#e2e8f0" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => formatCompact(v)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    name="Doanh thu"
                                    stroke="#FF6B00"
                                    strokeWidth={2.5}
                                    fill="url(#colorRevenue)"
                                    dot={{ fill: "#FF6B00", r: 3 }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Mini: 7-day daily bar */}
                <div className="chart-card">
                    <div className="chart-card__header">
                        <div>
                            <div className="chart-card__title">7 ngày gần nhất</div>
                            <div className="chart-card__subtitle">Doanh thu hằng ngày</div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="skeleton" style={{ height: 280 }} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={overview?.last7DaysRevenue ?? []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "#64748b", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#64748b", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => formatCompact(v)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="value"
                                    name="Doanh thu"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Salary Chart */}
            <div className="salary-charts-grid">
                <div className="chart-card">
                    <div className="chart-card__header">
                        <div>
                            <div className="chart-card__title">Thống kê lương nhân viên</div>
                            <div className="chart-card__subtitle">Tổng lương theo tháng — Năm {year}</div>
                        </div>
                    </div>
                    <div className="revenue-summary">
                        <div className="revenue-summary__item">
                            <div className="revenue-summary__label">Đã thanh toán</div>
                            <div className="revenue-summary__value" style={{ color: "#34d399" }}>
                                {formatVND(salaryStats?.totalSalaryPaid ?? 0)}
                            </div>
                        </div>
                        <div className="revenue-summary__item">
                            <div className="revenue-summary__label">Chưa thanh toán</div>
                            <div className="revenue-summary__value" style={{ color: "#f87171" }}>
                                {formatVND(salaryStats?.totalSalaryPending ?? 0)}
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={salaryStats?.chartData ?? []}>
                            <defs>
                                <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                            <XAxis
                                dataKey="label"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => formatCompact(v)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                name="Tổng lương"
                                fill="url(#colorSalary)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick stats sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="chart-card" style={{ flex: 1 }}>
                        <div className="chart-card__title" style={{ marginBottom: 18 }}>
                            🏢 Tổng quan nhanh
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                                {
                                    label: "Phiên hôm nay",
                                    value: String(overview?.sessionsToday ?? 0),
                                    icon: "🎱",
                                    color: "#FF6B00",
                                    bg: "rgba(255,107,0,0.08)",
                                },
                                {
                                    label: "Bàn đang chạy",
                                    value: String(overview?.activeTablesNow ?? 0),
                                    icon: "🟢",
                                    color: "#10b981",
                                    bg: "rgba(16,185,129,0.08)",
                                },
                                {
                                    label: "Khách hôm nay",
                                    value: String(overview?.totalCustomersToday ?? 0),
                                    icon: "👥",
                                    color: "#3b82f6",
                                    bg: "rgba(59,130,246,0.08)",
                                },
                            ].map((item) => (
                                <div key={item.label} className="quick-stat-row">
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 9,
                                            background: item.bg,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: 16,
                                        }}>
                                            {item.icon}
                                        </div>
                                        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 20, fontWeight: 800, color: item.color }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
