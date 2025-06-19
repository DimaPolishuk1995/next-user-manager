import { http } from "@/utils/http";
import type { User, Paged } from "@/types";
import { USERS_ENDPOINT, USER_BY_ID_ENDPOINT, IMPORT_USERS_ENDPOINT, DELETE_ALL_USERS_ENDPOINT, QUERY_PARAM } from "./user-endpoints";

export interface ListUsersOptions {
    page: number;
    size: number;
    sortBy?: keyof User;
    order?: "asc" | "desc";
}

export const usersApi = {
    list(options: ListUsersOptions) {
        const query = new URLSearchParams({
            [QUERY_PARAM.PAGE]: String(options.page),
            [QUERY_PARAM.PAGE_SIZE]: String(options.size),
            ...(options.sortBy
                ? {
                      [QUERY_PARAM.SORT_FIELD]: options.sortBy,
                      [QUERY_PARAM.SORT_ORDER]: options.order ?? "asc",
                  }
                : {}),
        });

        return http<Paged<User>>(`${USERS_ENDPOINT}?${query.toString()}`);
    },

    create(payload: Pick<User, "name" | "email" | "createdAt">) {
        return http<User>(USERS_ENDPOINT, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    update(id: number, payload: Partial<Omit<User, "id">>) {
        return http<User>(USER_BY_ID_ENDPOINT(id), {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    remove(id: number) {
        return http<void>(USER_BY_ID_ENDPOINT(id), { method: "DELETE" });
    },

    import(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return http<{ imported: number }>(IMPORT_USERS_ENDPOINT, {
            method: "POST",
            body: formData,
        });
    },

    removeAll() {
        return http<void>(DELETE_ALL_USERS_ENDPOINT, { method: "DELETE" });
    },
};
