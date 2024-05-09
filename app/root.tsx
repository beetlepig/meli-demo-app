import "@fontsource-variable/roboto-flex/wght.css";
import type { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { Fragment, ReactNode } from "react";
import { SearchBar } from "~/components/organisms/search-bar";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="es-CO">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className={"min-h-screen bg-gray-200 text-gray-900"}>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Fragment>
			<header>
				<SearchBar />
			</header>
			<Outlet />
		</Fragment>
	);
}
