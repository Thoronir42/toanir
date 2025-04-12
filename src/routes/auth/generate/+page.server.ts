import { defaultClaims } from '$lib/auth';
import { error } from '@sveltejs/kit';
import jwtServer from '../jwt.server';
import type { Actions, PageServerLoad } from './$types';

export const actions = {
	default: async ({params, request}) => {
        const data = await request.formData()

        const claims = JSON.parse(data.get("claims") as string);
        for (let name in claims) {
            if (!claims[name]) delete claims[name]
        }

        return {
            success: true,
            token: jwtServer.authorize(claims),
        }
	}
} satisfies Actions;

export const load: PageServerLoad = async ({locals, url}) => {
    if (!locals.user?.permissions.includes('generate-auth-token')) {
        return error(401, {
            message: "not-authorized",
        });
    };

    const token = null

    const iatStr = url.searchParams.get("iat")
    const iat = typeof iatStr === "string" ? new Date(iatStr) : new Date()

    const expStr = url.searchParams.get("exp")
    let exp = typeof expStr === "string" && new Date(expStr)
    if (!exp) {
        exp = new Date(iat)
        exp.setMonth(exp.getMonth() + 1)
    }

    return {
        tokenDefaults: {
            ...defaultClaims,
            iss: locals.user.sub,
            iat: iat.getTime(),
            exp: exp.getTime(),
            permissions: [],
        },
        token,
    }
}
