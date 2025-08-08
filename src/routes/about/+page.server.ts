import { env } from "$env/dynamic/private";
import { loadEditable } from "$lib/editable";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({url, locals}) => {
    return {
        pageTitle: "About",
        editable: await loadEditable(url.pathname),
        canEdit: locals.user?.sub === env.AUTH_SITE_OWNER,
    }
}
