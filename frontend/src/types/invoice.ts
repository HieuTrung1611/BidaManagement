import { SessionStatus } from "./session";

export interface IInvoiceDTO {
    sessionId: number;
    sessionStatus: SessionStatus;
    startTime: string;
    endTime: string | null;
    durationHours: number;
    tableName: string;
    tableType: string;
    tableHourlyRate: number;
    customerName: string | null;
    customerPhone: string | null;
    customerRank: string | null;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    tableRentalCost: number;
    combos: ISessionComboInvoice[];
    combosCost: number;
    products: ISessionProductInvoice[];
    productsCost: number;
    equipments: ISessionEquipmentInvoice[];
    equipmentsCost: number;
    subtotal: number;
    discountAmount: number;
    discountReason: string | null;
    totalAmount: number;
    notes: string | null;
    generatedAt: string;
    generatedBy: string;
}

export interface ISessionComboInvoice {
    comboId: number;
    comboName: string;
    quantity: number;
    price: number;
    totalAmount: number;
}

export interface ISessionProductInvoice {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

export interface ISessionEquipmentInvoice {
    id: number;
    equipmentId: number;
    equipmentName: string;
    quantity: number;
    hourlyRate: number;
    durationHours: number | null;
    totalAmount: number | null;
    isReturned: boolean;
}

export enum InvoiceStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export interface IInvoice {
    id: number;
    invoiceNumber: string;
    invoiceDate: string;
    status: InvoiceStatus;
    notes: string | null;
    
    // Session info
    sessionId: number;
    
    // Customer info (nullable for walk-in customers)
    customerId: number | null;
    customerName: string | null;
    customerPhone: string | null;
    
    // Branch info
    branchId: number;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    
    // Financial details
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    totalAmount: number;
    
    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface IInvoiceListParams {
    branchId: number;
    startDate?: string;
    endDate?: string;
    status?: InvoiceStatus;
    page?: number;
    size?: number;
}

export interface IRevenueReport {
    branchId: number;
    startDate: string;
    endDate: string;
    totalRevenue: number;
    invoiceCount: number;
    averageInvoiceAmount: number;
}
