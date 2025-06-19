"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CONFIRM_DIALOG_TEXT } from "./constants";
import type { ConfirmDialogProps } from "./types";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
    open,
    title = CONFIRM_DIALOG_TEXT.DEFAULT_TITLE,
    message = CONFIRM_DIALOG_TEXT.DEFAULT_MESSAGE,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm p-6">
                <DialogHeader className="flex flex-row items-start gap-3">
                    <span
                        className="inline-flex shrink-0 items-center justify-center
                           h-10 w-10 rounded-full bg-amber-100 text-amber-600"
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                        <DialogTitle>{title}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </div>
                </DialogHeader>

                <DialogFooter className="pt-6 flex flex-row justify-end gap-2">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="min-w-[5rem]"
                        autoFocus
                    >
                        {CONFIRM_DIALOG_TEXT.BTN_YES}
                    </Button>

                    <Button variant="ghost" onClick={onClose} className="min-w-[5rem]">
                        {CONFIRM_DIALOG_TEXT.BTN_CANCEL}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
