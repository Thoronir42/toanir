import { json } from "@sveltejs/kit";
import jwtServer from "../jwt.server";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({params, request}) => {
    const body = await request.json();
    const result = jwtServer.parse(body.code)

    return json(result);
}

