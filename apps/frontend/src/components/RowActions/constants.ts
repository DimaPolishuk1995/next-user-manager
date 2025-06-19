import { Edit2, Trash } from "lucide-react";

export const ROW_ACTION_ICONS = {
    EDIT: Edit2,
    DELETE: Trash,
} as const;

export const ROW_ACTION_TEXT = {
    EDIT_TOOLTIP: "Edit user",
    DELETE_TOOLTIP: "Delete user",
    CONFIRM_TITLE: "Delete user?",
    CONFIRM_QUESTION: (name: string) => `Do you really want to delete “${name}”?`,
} as const;
