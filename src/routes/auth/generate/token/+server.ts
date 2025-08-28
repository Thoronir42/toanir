import { error, json } from "@sveltejs/kit";
import jwtServer from "../../../../lib/jwt.server";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.user?.permissions.includes('generate-auth-token')) {
        return error(401, {
            message: "not-authorized",
        });
    };

    const data = await request.json()

    const claims = data.claims

    if (!claims || typeof claims !== "object") return error(400, {message: "Invalid claims"})

    for (let name in claims) {
        if (!claims[name]) delete claims[name]
    }

    const token = jwtServer.authorize(claims)

    return json({
        token,
    })
}

