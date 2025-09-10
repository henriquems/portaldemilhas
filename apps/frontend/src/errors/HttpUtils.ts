export type ErroHttpData = { message?: string };

export function isErroHttpData(data: unknown): data is ErroHttpData {
    return typeof data === "object" && data !== null && "message" in data;
}