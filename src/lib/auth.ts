import type { TokenContent } from "../routes/auth/jwt.server";

export const defaultClaims: UserAuthTokenData = {
    iss: "",
    sub: "",
    aud: "Toanir",
    iat: 0,
    exp: 0,
    permissions: [],
}

export function verifyUser(token: TokenContent|null): UserAuthTokenData | undefined {
    if (!token?.valid) return
    const payload = token.payload
    if (isUserLike(payload)) return payload
}

export function isUserLike(subject: unknown): subject is UserAuthTokenData {
    if (!subject || typeof subject !== "object" || Array.isArray(subject)) return false
    const obj = subject as Record<string, unknown>
    if (typeof obj.sub !== "string") return false
    if (typeof obj.iss !== "string") return false
    if (typeof obj.aud !== "string") return false
    if (typeof obj.iat !== "number") return false
    if (typeof obj.exp !== "number") return false
    if (obj.jti && typeof obj.jti !== "string") return false
    if (!Array.isArray(obj.permissions)) return false

    return true
}

export type UserAuthTokenData = {
    iss: string,
    sub: string,
    aud: string,
    iat: number,
    exp: number,
    permissions: string[],
    jti?: string,
}
