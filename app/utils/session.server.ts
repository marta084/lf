import { createCookieSessionStorage } from '@remix-run/cloudflare'

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_session',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: ["SESSION_SECRET"],
		secure: true,
	},
})
