import { constants } from "@/config/constants";

export interface IPagination {
    page: number;
    limit: number;
    total_rows: number;
    total_pages: number;
}

export type TPlatformName =
    (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
