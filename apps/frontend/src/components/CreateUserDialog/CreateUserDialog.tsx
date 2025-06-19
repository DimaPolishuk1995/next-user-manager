/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usersApi } from "@/api/usersApi";
import { usersQueryKeys } from "@/query-keys/usersQueryKeys";
import { CREATE_DIALOG_TEXT } from "./constants";
import { createUserSchema, CreateUserFormValues } from "./types";

export default function CreateUserDialog() {
    const [isOpen, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const DEFAULT_VALUES: CreateUserFormValues = {
        name: "",
        email: "",
        createdAt: new Date().toISOString().slice(0, 10),
    };

    const form = useForm<CreateUserFormValues>({
        mode: "onChange",
        resolver: zodResolver(createUserSchema),
        defaultValues: DEFAULT_VALUES,
        shouldFocusError: true,
    });

    const {
        handleSubmit,
        reset,
        formState: { isValid, isSubmitting },
    } = form;

    const createUserMutation = useMutation({
        mutationFn: (data: CreateUserFormValues) => usersApi.create(data),
        onSuccess: () => {
            toast.success(CREATE_DIALOG_TEXT.TOAST_OK);
            queryClient.invalidateQueries({ queryKey: usersQueryKeys.root }).then(() => {});
            reset(DEFAULT_VALUES);
            setOpen(false);
        },
    });

    useEffect(() => {
        if (!isOpen) reset(DEFAULT_VALUES);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">{CREATE_DIALOG_TEXT.TRIGGER_LABEL}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg p-6">
                <DialogHeader>
                    <DialogTitle>{CREATE_DIALOG_TEXT.TITLE}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit((data) => createUserMutation.mutate(data))} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{CREATE_DIALOG_TEXT.FORM.NAME}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} autoFocus />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{CREATE_DIALOG_TEXT.FORM.EMAIL}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="createdAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{CREATE_DIALOG_TEXT.FORM.CREATED_AT}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                {CREATE_DIALOG_TEXT.BTN_CANCEL}
                            </Button>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                {isSubmitting ? CREATE_DIALOG_TEXT.BTN_SAVING : CREATE_DIALOG_TEXT.BTN_SAVE}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
