import { OnChangeFn, SortingState } from "@tanstack/react-table";
import type { User } from "@/types";

export interface UsersTableProps {
    data: User[];
    total: number;
    page: number;
    pageSize?: number;
    sorting: SortingState;
    onPageChange(newPage: number): void;
    onSortingChangeAction: OnChangeFn<SortingState>;
    isFetching?: boolean;
}
