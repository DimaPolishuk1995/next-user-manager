"use client";

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { USERS_TABLE_COLUMNS } from "./users-table.columns";
import { TABLE_TEXT, DEFAULT_PAGE_SIZE } from "./constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { UsersTableProps } from "@/components/UsersTable/types";

export default function UsersTable({
    data,
    total,
    page,
    pageSize = DEFAULT_PAGE_SIZE,
    sorting,
    onPageChange,
    onSortingChangeAction,
    isFetching,
}: UsersTableProps) {
    const pageCount = Math.ceil(total / pageSize);

    const table = useReactTable({
        data,
        columns: USERS_TABLE_COLUMNS,
        pageCount,
        state: { sorting },
        onSortingChange: onSortingChangeAction,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const hasPages = pageCount > 1;
    const previousDisabled = !hasPages || page === 1;
    const nextDisabled = !hasPages || page === pageCount;
    const rows = table.getRowModel().rows;
    const placeholders = pageSize - rows.length;
    const getColKey = (col: (typeof USERS_TABLE_COLUMNS)[number], fallback: number) =>
        "accessorKey" in col ? String(col.accessorKey) : (col.id ?? `col-${fallback}`);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full overflow-x-auto shadow ring-1 ring-muted/10 sm:rounded-lg">
                <Table className="w-full caption-bottom">
                    <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer select-none"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc" && " ▲"}
                                        {header.column.getIsSorted() === "desc" && " ▼"}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody className="[&>*:nth-child(even)]:bg-muted/20">
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {Array.from({ length: placeholders }).map((_, i) => (
                            <TableRow key={`ph-${i}`} className="h-12">
                                {USERS_TABLE_COLUMNS.map((col, idx) => (
                                    <TableCell key={getColKey(col, idx)} />
                                ))}
                            </TableRow>
                        ))}

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={USERS_TABLE_COLUMNS.length} className="text-center py-8">
                                    {isFetching ? TABLE_TEXT.LOADING : TABLE_TEXT.EMPTY}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4 cursor-pointer">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            aria-disabled={previousDisabled}
                            className={previousDisabled ? "pointer-events-none opacity-50" : ""}
                            onClick={() => !previousDisabled && onPageChange(Math.max(1, page - 1))}
                        />
                    </PaginationItem>

                    {[...Array(pageCount)].map((_, index) => {
                        const pageNumber = index + 1;
                        const shouldShow = Math.abs(pageNumber - page) <= 1 || pageNumber === 1 || pageNumber === pageCount;

                        if (!shouldShow) return null;

                        return (
                            <PaginationItem key={pageNumber}>
                                <Button
                                    size="sm"
                                    variant={page === pageNumber ? "default" : "outline"}
                                    onClick={() => onPageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            </PaginationItem>
                        );
                    })}

                    {page < pageCount - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            aria-disabled={nextDisabled}
                            className={nextDisabled ? "pointer-events-none opacity-50" : ""}
                            onClick={() => !nextDisabled && onPageChange(Math.min(pageCount, page + 1))}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
