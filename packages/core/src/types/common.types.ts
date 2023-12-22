export interface IPagination {
    page: number;
    limit: number;
    total_rows: number;
    total_pages: number;
}

export interface ITimestamps {
    created_at: Date;
    updated_at: Date;
}