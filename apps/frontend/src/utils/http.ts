export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
    const base = typeof window === "undefined" ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
        throw new Error("Missing API base URL.");
    }
    const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    const isFormData = init.body instanceof FormData;
    const res = await fetch(url, {
        ...init,
        headers: isFormData ? init.headers : { "Content-Type": "application/json", ...(init.headers || {}) },
    });
    if (!res.ok) {
        let reason: string;
        try {
            const data = await res.json();
            reason = Array.isArray(data.message) ? data.message.join("; ") : data.message;
        } catch {
            reason = await res.text();
        }
        throw new Error(`API ${res.status}: ${res.statusText} – ${reason}`);
    }
    return (await res.json()) as Promise<T>;
}
