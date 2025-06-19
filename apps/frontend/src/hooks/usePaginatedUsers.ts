import { useEffect } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

import { usersApi } from "@/api/usersApi";
import { usersQueryKeys } from "@/query-keys/usersQueryKeys";
import { Paged, User } from "@/types";

export const DEFAULT_PAGE_SIZE = 20 as const;

export type SortDirection = "asc" | "desc";

export interface UsePaginatedUsersOptions {
    page: number;
    pageSize?: number;
    sortBy?: keyof User;
    sortDir?: SortDirection;
}

export type UsePaginatedUsersResult = UseQueryResult<Paged<User>, Error>;

export default function usePaginatedUsers({
    page,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    sortDir = "asc",
}: UsePaginatedUsersOptions): UsePaginatedUsersResult {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: usersQueryKeys.page({ page, size: pageSize, sort: sortBy ?? "", order: sortDir }),
        queryFn: () => usersApi.list({ page, size: pageSize, sortBy, order: sortDir }),
        placeholderData: (prev) => prev,
    });

    const pageCount = Math.ceil((query.data?.total ?? 0) / pageSize);

    useEffect(() => {
        const next = page + 1;
        if (next <= pageCount) {
            void queryClient.prefetchQuery({
                queryKey: usersQueryKeys.page({ page: next, size: pageSize, sort: sortBy ?? "", order: sortDir }),
                queryFn: () => usersApi.list({ page: next, size: pageSize, sortBy, order: sortDir }),
            });
        }
    }, [page, pageCount, pageSize, sortBy, sortDir, queryClient]);

    return query;
}
