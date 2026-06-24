import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/base";

const API_URL = "/statistics";

export interface ChartDataPoint {
    label: string;
    value: number;
    count: number;
}

export interface DashboardOverview {
    revenueToday: number;
    revenueThisMonth: number;
    sessionsToday: number;
    activeTablesNow: number;
    totalCustomersToday: number;
    totalEmployees: number;
    last7DaysRevenue: ChartDataPoint[];
    monthlyRevenue: ChartDataPoint[];
}

export interface RevenueStatistics {
    totalRevenue: number;
    totalSessions: number;
    totalInvoices: number;
    averagePerSession: number;
    period: "week" | "month" | "year";
    periodLabel: string;
    chartData: ChartDataPoint[];
}

export interface SalaryStatistics {
    year: number;
    month?: number;
    totalEmployees: number;
    totalSalaryPaid: number;
    totalSalaryPending: number;
    chartData: ChartDataPoint[];
}

const statisticsService = {
    getDashboardOverview: async (
        branchId?: number
    ): Promise<ApiResponse<DashboardOverview>> => {
        const res = await axiosClient.get(`${API_URL}/overview`, {
            params: { branchId },
        });
        return res.data;
    },

    getMonthlyRevenue: async (
        year?: number,
        month?: number,
        branchId?: number
    ): Promise<ApiResponse<RevenueStatistics>> => {
        const res = await axiosClient.get(`${API_URL}/revenue/monthly`, {
            params: { year, month, branchId },
        });
        return res.data;
    },

    getYearlyRevenue: async (
        year?: number,
        branchId?: number
    ): Promise<ApiResponse<RevenueStatistics>> => {
        const res = await axiosClient.get(`${API_URL}/revenue/yearly`, {
            params: { year, branchId },
        });
        return res.data;
    },

    getWeeklyRevenue: async (
        year?: number,
        branchId?: number
    ): Promise<ApiResponse<RevenueStatistics>> => {
        const res = await axiosClient.get(`${API_URL}/revenue/weekly`, {
            params: { year, branchId },
        });
        return res.data;
    },

    getYearlySalaryStats: async (
        year?: number,
        branchId?: number
    ): Promise<ApiResponse<SalaryStatistics>> => {
        const res = await axiosClient.get(`${API_URL}/salary/yearly`, {
            params: { year, branchId },
        });
        return res.data;
    },

    getMonthlySalaryStats: async (
        year?: number,
        month?: number,
        branchId?: number
    ): Promise<ApiResponse<SalaryStatistics>> => {
        const res = await axiosClient.get(`${API_URL}/salary/monthly`, {
            params: { year, month, branchId },
        });
        return res.data;
    },
};

export default statisticsService;
