import { invariantResponse } from "@epic-web/invariant";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";
import Button from "~/components/atoms/Button";
import PageContainer from "~/components/layout/page-container";
import BreadcrumbList from "~/components/molecules/breadcrumb-list";
import useFormatPrice from "~/hooks/format-price";
import { itemsIdRouteLoaderAdapter } from "~/routes/items_.$itemId/adapters/loader.adapter";

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<PageContainer>
				<div className={"flex h-[calc(100vh-56px)] items-center text-center"}>
					<div>
						<h1>
							{error.status} {error.statusText}
						</h1>
						<p>{error.data}</p>
					</div>
				</div>
			</PageContainer>
		);
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	} else {
		return <h1>Unknown Error</h1>;
	}
}
export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
	return [
		{ title: data ? data.item.title : isRouteErrorResponse(error) ? error.status : "Error" },
		{
			name: "description",
			content: data
				? `${data.item.description.substring(0, 200).trim()}...`
				: isRouteErrorResponse(error)
					? error.statusText
					: "Unknown Error"
		}
	];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
	const itemId = params.itemId;
	invariantResponse(itemId, "Missing itemId param");

	const loaderData = await itemsIdRouteLoaderAdapter(itemId);

	return json(loaderData);
};

export default function ItemsIdRoute() {
	const { item, author } = useLoaderData<typeof loader>();
	const formattedPrice = useFormatPrice({
		currency: item.price.currency,
		decimals: item.price.decimals,
		amount: item.price.amount
	});

	return (
		<PageContainer>
			{author.name && <p className={"hidden"}>author name: {author.name}</p>}
			{author.lastName && <p className={"hidden"}>author last name: {author.lastName}</p>}

			<BreadcrumbList categoryList={item.categories} />

			<section className={"mb-20 grid grid-cols-10 gap-3 rounded-none bg-white lg:rounded-sm"}>
				<div className={"col-span-10 space-y-8 pb-8 pl-8 pr-8 pt-8 lg:col-span-7 lg:pr-0"}>
					<div className={"space-y-4"}>
						<h6 className={"text-sm font-light text-gray-800 lg:hidden"}>
							{item.condition === "new" ? "Nuevo" : "Usado"}
						</h6>
						<h1 className={"text-2xl font-semibold lg:hidden"} data-testid={"item-title-mobile"}>
							{item.title}
						</h1>
					</div>

					<img
						src={item.picture}
						alt={item.title}
						data-testid={"item-main-image"}
						className={"max-h-[680px] object-contain"}
						width={680}
					/>
				</div>
				<div className={"col-span-10 space-y-4 pb-8 pl-8 pr-8 pt-8 lg:col-span-3 lg:pl-0"}>
					<h6 className={"hidden text-sm font-light text-gray-800 lg:block"}>
						{item.condition === "new" ? "Nuevo" : "Usado"}
					</h6>
					<div className={"space-y-8"}>
						<h1 className={"hidden text-2xl font-semibold lg:block"} data-testid={"item-title"}>
							{item.title}
						</h1>
						<h2 className={"text-4xl"}>{formattedPrice}</h2>
						<Button />
					</div>
				</div>
				<div className={"col-span-10 space-y-8 pb-8 pl-8 pr-8 pt-8 lg:col-span-7 lg:pr-0"}>
					<h5 className={"text-2xl"}>Descripción del producto</h5>
					<p className={"text-base font-light text-gray-700"} data-testid={"item-description"}>
						{item.description}
					</p>
				</div>
			</section>
		</PageContainer>
	);
}
