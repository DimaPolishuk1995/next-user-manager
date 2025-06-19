import type { User } from "@/types";

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10 as const;
export const DEFAULT_SORT_FIELD = undefined as keyof User | undefined;
export const DEFAULT_SORT_DIRECTION = "asc" as const;

export interface UsersQueryParameters {
    pageNumber: number;
    pageSize: number;
    sortBy?: keyof User;
    sortDirection: "asc" | "desc";
}

export function parseUsersQueryParameters(params?: Record<string, string>): UsersQueryParameters {
    return {
        pageNumber: Number(params?.page ?? DEFAULT_PAGE_NUMBER),
        pageSize: Number(params?.pageSize ?? DEFAULT_PAGE_SIZE),
        sortBy: (params?.sortBy as keyof User) ?? DEFAULT_SORT_FIELD,
        sortDirection: (params?.sortOrder as "asc" | "desc") ?? DEFAULT_SORT_DIRECTION,
    };
}
