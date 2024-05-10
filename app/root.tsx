import "@fontsource-variable/roboto-flex/wght.css";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { Fragment, type ReactNode } from "react";
import SearchBar from "~/components/organisms/search-bar";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];
export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const search = url.searchParams.get("search");

	return json({ search });
};

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
				{process.env.NODE_ENV === "development" && <script src="http://localhost:8097"></script>}
			</body>
		</html>
	);
}

export default function App() {
	const { search } = useLoaderData<typeof loader>();

	return (
		<Fragment>
			<header>
				<SearchBar value={search ?? undefined} />
			</header>
			<Outlet />
		</Fragment>
	);
}
