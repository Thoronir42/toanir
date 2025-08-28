import type { TokenContent } from "./jwt.server";

export class TokenGenerate {
    private readonly defaultClaims: TokenClaim[]
    public claims = $state<TokenClaim[]>([])
    public token = $state("")

    constructor(claims: TokenClaim[]) {
        this.defaultClaims = claims
        this.reset()
    }

    async generate() {
        const payload = Object.fromEntries(this.claims.map((claim) => [claim.name, claim.value]))
        const response = await fetch("/auth/generate/token", {
            method: "POST",
            body: JSON.stringify({claims: payload}),
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
            },
        })
        const data = await response.json()
        this.token = data.token
    }

    reset() {
        this.claims = structuredClone(this.defaultClaims)
        this.token = ""
    }
}

export type TokenClaim = {name: string, value: any, readonly?: boolean}

export class TokenCheck {
    public status = $state<"idle" | "busy" | "done" | "error">("idle");
    public code = $state("");
    public content = $state<null | TokenContent>(null)

    public readonly contentParsed = $derived.by(() => {
        if (!this.content) return null
        const {iat, exp, iss, aud, permissions, ...rest} = this.content.payload

        const iatDate = new Date(iat)
        const expDate = new Date(exp)

        const restEmpty = !Object.keys(rest).length

        return {
            entries: [
                {label: "Valid", value: this.content.valid},
                {label: "Permissions", value: permissions},
                {label: "ISS", value: iss},
                {label: "AUD", value: aud},
                {label: "IAT", value: iatDate.toISOString()},
                {label: "EXP", value: expDate.toISOString()},
            ],
            rest: restEmpty ? null : rest,
        }
    })

    constructor(private opts?: {onSuccess?: (content: NonNullable<TokenCheck["content"]>) => unknown}) {

    }

    public async run(code?: string) {
        if (this.status !== "idle") {
            return;
        }
        if (code) {
            this.code = code
        }

        this.content = null;
        this.status = "busy";
        try {
            const response = await fetch(new URL("/auth/verify", window.location.toString()), {
                method: "POST",
                body: JSON.stringify({code: this.code}),
            });
            this.content = await response.json();
            this.status = "done"
            this.opts?.onSuccess?.(this.content!)
        } catch (e) {
            console.error("run check failed", e)
            this.status = "error";
        }
    }

    public reset() {
        this.code = ""
        this.content = null
        this.status = "idle"
    }
}
