import type { Handle } from "@sveltejs/kit";
import jwtServer from "$lib/jwt.server";
import { verifyUser } from "$lib/auth";

export const handle: Handle = ({event, resolve}) => {
    const accessToken = event.cookies.get('toanir.accessToken');
    if (accessToken) {
        const token = jwtServer.parse(accessToken)
        
        event.locals.user = verifyUser(token)
    }

    return resolve(event);
}
