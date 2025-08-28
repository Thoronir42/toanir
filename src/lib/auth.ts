import { env } from "$env/dynamic/public";
import type { TokenContent } from "./jwt.server";
import type { TokenClaim } from "./token.svelte";


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

export function getDefaultClaims(locals: App.Locals, opts: {iat: Date, exp: Date}): TokenClaim[] {
    return [
        {name: "iss", value: locals.user?.sub || "", readonly: true},
        {name: "aud", value: env.PUBLIC_SITE_OWNER, readonly: true},
        {name: "iat", value: opts.iat.getTime(), readonly: true},
        {name: "exp", value: opts.exp.getTime(), readonly: true},
        {name: "permissions", value: []},
    ]
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
