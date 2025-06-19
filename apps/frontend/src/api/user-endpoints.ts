export const BASE_USERS_PATH = "/api/users" as const;

export const USERS_ENDPOINT = BASE_USERS_PATH;
export const USER_BY_ID_ENDPOINT = (id: number) => `${BASE_USERS_PATH}/${id}`;
export const IMPORT_USERS_ENDPOINT = `${BASE_USERS_PATH}/import`;
export const DELETE_ALL_USERS_ENDPOINT = BASE_USERS_PATH;

export const QUERY_PARAM = {
    PAGE: "page",
    PAGE_SIZE: "pageSize",
    SORT_FIELD: "sortBy",
    SORT_ORDER: "sortOrder",
} as const;
