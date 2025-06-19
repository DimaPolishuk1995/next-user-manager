"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useImportUsers, useDeleteAllUsers } from "@/hooks/useUserMutations";
import { USERS_TOOLBAR_TEXT } from "./constants";
import CreateUserDialog from "@/components/CreateUserDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function UsersToolbar({ total }: { total: number }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const isEmpty = total === 0;

    const importUsersMutation = useImportUsers();
    const deleteAllMutation = useDeleteAllUsers();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        importUsersMutation.mutate(file, {
            onError: (err) => toast.error(err.message),
            onSettled: () => {
                e.target.value = "";
            },
        });
    }

    return (
        <div className="flex flex-wrap gap-2 items-center justify-between">
            <p className="text-sm text-muted-foreground">{USERS_TOOLBAR_TEXT.COUNT(total)}</p>

            <div className="flex flex-wrap gap-2">
                <CreateUserDialog />

                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importUsersMutation.isPending}>
                    {USERS_TOOLBAR_TEXT.IMPORT_BTN}
                </Button>

                <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={isEmpty || deleteAllMutation.isPending}>
                    {USERS_TOOLBAR_TEXT.DELETE_ALL_BTN}
                </Button>

                <ConfirmDialog
                    open={isConfirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => deleteAllMutation.mutate()}
                    title={USERS_TOOLBAR_TEXT.DELETE_ALL_TITLE}
                    message={USERS_TOOLBAR_TEXT.DELETE_ALL_MESSAGE}
                />
            </div>
        </div>
    );
}
