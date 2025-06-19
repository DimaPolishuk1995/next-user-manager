export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface Paged<T> {
    data: T[];
    total: number;
}
