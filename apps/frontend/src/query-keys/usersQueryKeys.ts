export const USERS_QUERY_ROOT_KEY = "users" as const;

export const USERS_QUERY_SUBKEY = {
    BY_ID: "by-id",
    PAGE: "page",
} as const;

export interface UsersPageKeyParams {
    page: number;
    size: number;
    sort: string;
    order: "asc" | "desc";
}

export const usersQueryKeys = {
    root: [USERS_QUERY_ROOT_KEY] as const,

    page: ({ page, size, sort, order }: UsersPageKeyParams) =>
        [USERS_QUERY_ROOT_KEY, USERS_QUERY_SUBKEY.PAGE, page, size, sort, order] as const,

    byId: (id: number) => [USERS_QUERY_ROOT_KEY, USERS_QUERY_SUBKEY.BY_ID, id] as const,
};
