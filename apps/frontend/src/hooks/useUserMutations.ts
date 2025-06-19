import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersApi } from "@/api/usersApi";
import { usersQueryKeys } from "@/query-keys/usersQueryKeys";
import type { User, Paged } from "@/types";

export const USER_MUTATION_TEXT = {
    TOAST_CREATED: "User created",
    TOAST_UPDATED: "User updated",
    TOAST_DELETED: "User deleted",
    TOAST_IMPORTED: (n: number) => `${n} users imported`,
    TOAST_DELETED_ALL: "All users deleted",
} as const;

export type UpdateUserPayload = { id: number } & Partial<Omit<User, "id">>;

function patchPages(qc: ReturnType<typeof useQueryClient>, patch: (page: Paged<User>) => Paged<User>) {
    qc.setQueriesData({ queryKey: usersQueryKeys.root, exact: false }, (old: Paged<User> | undefined) =>
        old ? patch(structuredClone(old)) : old,
    );
}

export function useCreateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: usersApi.create,
        onSuccess(newUser) {
            patchPages(qc, (p) => ({ ...p, data: [newUser, ...p.data], total: p.total + 1 }));
            toast.success(USER_MUTATION_TEXT.TOAST_CREATED);
            qc.invalidateQueries({ queryKey: usersQueryKeys.root });
        },
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: UpdateUserPayload) => usersApi.update(id, body),
        onSuccess(updated) {
            patchPages(qc, (p) => ({
                ...p,
                data: p.data.map((u) => (u.id === updated.id ? updated : u)),
            }));
            toast.success(USER_MUTATION_TEXT.TOAST_UPDATED);
            qc.invalidateQueries({ queryKey: usersQueryKeys.root });
        },
    });
}

export function useDeleteUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: usersApi.remove,
        onSuccess(_, id) {
            patchPages(qc, (p) => ({
                ...p,
                data: p.data.filter((u) => u.id !== id),
                total: p.total - 1,
            }));
            toast.success(USER_MUTATION_TEXT.TOAST_DELETED);
            qc.invalidateQueries({ queryKey: usersQueryKeys.root });
        },
    });
}

export function useImportUsers() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: usersApi.import,
        onSuccess({ imported }) {
            toast.success(USER_MUTATION_TEXT.TOAST_IMPORTED(imported));
            qc.invalidateQueries({ queryKey: usersQueryKeys.root });
        },
    });
}

export function useDeleteAllUsers() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: usersApi.removeAll,
        onSuccess() {
            patchPages(qc, () => ({ data: [], total: 0 }));
            toast.success(USER_MUTATION_TEXT.TOAST_DELETED_ALL);
            qc.invalidateQueries({ queryKey: usersQueryKeys.root });
        },
    });
}
