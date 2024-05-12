import "@fontsource-variable/roboto-flex/wght.css";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation
} from "@remix-run/react";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@vercel/remix";
import { Fragment, type ReactNode, useMemo } from "react";
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
	const navigation = useNavigation();
	const searching = useMemo(
		() => navigation.location && new URLSearchParams(navigation.location.search).has("search"),
		[navigation.location]
	);

	return (
		<Fragment>
			<header>
				<SearchBar value={search ?? undefined} loading={searching} />
			</header>
			<Outlet />
		</Fragment>
	);
}
