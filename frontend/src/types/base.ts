export interface ApiResponse<T> {
    status: string;
    success: boolean;
    message: string;
    data: T | null;
    errors?: Record<string, string>;
}

export interface IBaseResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
}
