import { QueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/usersApi";
import { usersQueryKeys } from "@/query-keys/usersQueryKeys";
import type { UsersQueryParameters } from "./query-params";

export async function prefetchUsersList(parameters: UsersQueryParameters) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: usersQueryKeys.page({
            page: parameters.pageNumber,
            size: parameters.pageSize,
            sort: parameters.sortBy ?? "",
            order: parameters.sortDirection,
        }),
        queryFn: () =>
            usersApi.list({
                page: parameters.pageNumber,
                size: parameters.pageSize,
                sortBy: parameters.sortBy,
                order: parameters.sortDirection,
            }),
    });

    return { queryClient };
}
