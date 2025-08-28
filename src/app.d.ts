// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserAuthTokenData } from "$lib/auth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: UserAuthTokenData,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
