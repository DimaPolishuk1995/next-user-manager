export function formatDateISO(d: string | Date) {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
}
