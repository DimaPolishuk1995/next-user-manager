"use client";

import { useState } from "react";
import { useDeleteUser } from "@/hooks/useUserMutations";
import { ROW_ACTION_ICONS, ROW_ACTION_TEXT } from "./constants";
import { Button } from "@/components/ui/button";
import EditUserDialog from "@/components/EditUserDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { RowActionsProps } from "@/components/RowActions/types";

export default function RowActions({ user }: RowActionsProps) {
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const { mutate: deleteUser, isPending } = useDeleteUser();

    const EditIcon = ROW_ACTION_ICONS.EDIT;
    const DeleteIcon = ROW_ACTION_ICONS.DELETE;

    return (
        <div className="flex gap-1 justify-end">
            <Button
                size="icon"
                variant="ghost"
                title={ROW_ACTION_TEXT.EDIT_TOOLTIP}
                onClick={() => setEditDialogOpen(true)}
                className="text-muted-foreground transition
                   hover:text-primary hover:bg-primary/10
                   active:scale-95
                   focus-visible:ring-2 focus-visible:ring-primary"
            >
                <EditIcon size={14} />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                title={ROW_ACTION_TEXT.DELETE_TOOLTIP}
                disabled={isPending}
                onClick={() => setConfirmOpen(true)}
                className="text-destructive/75 transition
                   hover:text-destructive hover:bg-destructive/10
                   active:scale-95
                   focus-visible:ring-2 focus-visible:ring-destructive"
            >
                <DeleteIcon size={14} />
            </Button>

            {isEditDialogOpen && <EditUserDialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)} user={user} />}

            {isConfirmOpen && (
                <ConfirmDialog
                    open={isConfirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title={ROW_ACTION_TEXT.CONFIRM_TITLE}
                    message={ROW_ACTION_TEXT.CONFIRM_QUESTION(user.name)}
                    onConfirm={() => deleteUser(user.id)}
                />
            )}
        </div>
    );
}
