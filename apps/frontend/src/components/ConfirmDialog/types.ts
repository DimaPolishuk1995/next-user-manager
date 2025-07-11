export interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm(): void;
    onClose(): void;
}
