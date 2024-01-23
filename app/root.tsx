import { cssBundleHref } from "@remix-run/css-bundle";
import  { type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// siteui
import Header from '~/siteui/header'
import Footer from "./siteui/footer";

// favicon
import lfBlogFavicon from '~/assets/favicon.ico' 
// styles
import tailwindStyleSheet from '~/styles/tailwind.css'



export const links: LinksFunction = () => {
	return [
		// ...(process.env.NODE_ENV === 'development'
		// 	? []
		// 	: []),
		{ rel: 'icon', href: lfBlogFavicon, type: 'image/x-icon' },
		{ rel: 'stylesheet', href: tailwindStyleSheet },

		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
	].filter(Boolean)
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
