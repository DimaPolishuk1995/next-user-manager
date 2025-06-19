import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import type { User } from "@/types";
import { TABLE_TEXT } from "./constants";
import RowActions from "@/components/RowActions/RowActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const column = createColumnHelper<User>();

export function withTooltip(value: string) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <span className="inline-block w-40 truncate">{value}</span>
                </TooltipTrigger>
                <TooltipContent>{value}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export const USERS_TABLE_COLUMNS: ColumnDef<User, string>[] = [
    column.accessor("name", {
        header: TABLE_TEXT.HEADER_NAME,
        cell: ({ getValue }) => withTooltip(getValue<string>()),
        sortingFn: "alphanumeric",
    }),
    column.accessor("email", {
        header: TABLE_TEXT.HEADER_EMAIL,
        cell: ({ getValue }) => withTooltip(getValue<string>()),
        sortingFn: "alphanumeric",
    }),
    column.accessor("createdAt", {
        header: TABLE_TEXT.HEADER_CREATED,
        enableSorting: true,
        sortingFn: "datetime",
        cell: ({ getValue }) => {
            const raw = getValue<Date | string>();
            if (!raw) return "—";

            const date = raw instanceof Date ? raw : new Date(raw);
            return format(date, "yyyy-MM-dd");
        },
    }),
    column.display({
        id: "actions",
        header: () => null,
        cell: (ctx) => <RowActions user={ctx.row.original} />,
    }),
];
