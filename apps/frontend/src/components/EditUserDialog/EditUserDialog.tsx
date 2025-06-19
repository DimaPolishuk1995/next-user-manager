"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUpdateUser } from "@/hooks/useUserMutations";

import { EDIT_DIALOG_TEXT } from "./constants";
import { editUserSchema, EditUserFormValues, EditUserDialogProps } from "./types";

export default function EditUserDialog({ open, onClose, user }: EditUserDialogProps) {
    const { mutateAsync } = useUpdateUser();

    const form = useForm<EditUserFormValues>({
        mode: "onChange",
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.slice(0, 10),
        },
        shouldFocusError: true,
    });

    const {
        handleSubmit,
        reset,
        formState: { isValid, isSubmitting },
    } = form;

    useEffect(() => {
        reset({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.slice(0, 10),
        });
    }, [reset, user]);

    async function onSubmit(values: EditUserFormValues) {
        await mutateAsync({ id: user.id, ...values });
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{EDIT_DIALOG_TEXT.TITLE}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{EDIT_DIALOG_TEXT.FORM.NAME}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{EDIT_DIALOG_TEXT.FORM.EMAIL}</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="createdAt"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{EDIT_DIALOG_TEXT.FORM.CREATED_AT}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="secondary" type="button" onClick={onClose}>
                                {EDIT_DIALOG_TEXT.BTN_CANCEL}
                            </Button>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                {isSubmitting ? EDIT_DIALOG_TEXT.BTN_SAVING : EDIT_DIALOG_TEXT.BTN_SAVE}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
