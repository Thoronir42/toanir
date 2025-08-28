import jsonwebtoken from "jsonwebtoken";

import { AUTH_JWT_SECRET } from "$env/static/private";

export function authorize(payload: Record<string, any>) {
    return jsonwebtoken.sign(payload, AUTH_JWT_SECRET)
}

export function parse(token: string): TokenContent|null {
    try {
        const result = jsonwebtoken.verify(token, AUTH_JWT_SECRET, {complete: true})
        
        return {valid: true, ...result, payload: typeof result.payload === "object" ? result.payload : {}}
    } catch (e) {
        const data = jsonwebtoken.decode(token, {complete: true})
        if (!data) return null;

        return {valid: false, ...data, payload: typeof data.payload === "object" ? data.payload : {}}
    }
}

export default {
    authorize,
    parse,
}

export type TokenContent = { valid: boolean, header: Record<string, any>, payload: Record<string, any>, signature: string }
