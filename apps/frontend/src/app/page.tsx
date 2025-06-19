import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { parseUsersQueryParameters, UsersQueryParameters } from "@/utils/query-params";
import { prefetchUsersList } from "@/utils/prefetch-users";
import UsersPageContainer from "@/modules/UsersPageContainer";

export const revalidate = 60;

export default async function UsersPage({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
    const query: UsersQueryParameters = parseUsersQueryParameters(await searchParams);

    const { queryClient } = await prefetchUsersList(query);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UsersPageContainer
                initialPage={query.pageNumber}
                pageSize={query.pageSize}
                initialSorting={query.sortBy ? [{ id: query.sortBy, desc: query.sortDirection === "desc" }] : []}
            />
        </HydrationBoundary>
    );
}
