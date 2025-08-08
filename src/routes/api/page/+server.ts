import { error, type Handle } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({request}) => {
    const {data, page} = await request.json()
    console.log({page, data})

    return error(501, 'POSTS page not implemented');
}
