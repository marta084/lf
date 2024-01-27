import { createCookieSessionStorage } from '@remix-run/cloudflare'

export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_toast',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: ["SESSION_SECRET"],
		secure: true,
	},
})
