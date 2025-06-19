"use client";

import { useState } from "react";
import { SortingState } from "@tanstack/react-table";

import usePaginatedUsers from "@/hooks/usePaginatedUsers";
import type { User } from "@/types";
import UsersTable from "@/components/UsersTable";
import UsersToolbar from "@/components/UsersToolbar";

export interface UsersPageContainerProps {
    initialPage: number;
    pageSize: number;
    initialSorting: { id: keyof User; desc: boolean }[];
}

export default function UsersPageContainer({ initialPage, pageSize, initialSorting }: UsersPageContainerProps) {
    const [page, setPage] = useState(initialPage);
    const [sorting, setSorting] = useState<SortingState>(initialSorting);

    const sortField = sorting[0]?.id as keyof User | undefined;
    const sortDirection = sorting[0]?.desc ? "desc" : "asc";

    const { data, isFetching } = usePaginatedUsers({
        page,
        pageSize,
        sortBy: sortField,
        sortDir: sortDirection,
    });

    const users = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <UsersToolbar total={total} />
            <UsersTable
                data={users}
                total={total}
                page={page}
                pageSize={pageSize}
                sorting={sorting}
                onPageChange={setPage}
                onSortingChangeAction={setSorting}
                isFetching={isFetching}
            />
        </div>
    );
}
