import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDefaultClaims } from '$lib/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user?.permissions.includes('generate-auth-token')) {
        return error(401, {
            message: "not-authorized",
        });
    };

    const iatStr = url.searchParams.get("iat")
    const iat = typeof iatStr === "string" ? new Date(iatStr) : new Date()

    const expStr = url.searchParams.get("exp")
    let exp = typeof expStr === "string" && new Date(expStr)
    if (!exp) {
        exp = new Date(iat)
        exp.setMonth(exp.getMonth() + 1)
    }

    return {
        claims: getDefaultClaims(locals, { iat, exp }),
    }
}
