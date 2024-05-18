import { itemsRouteLoaderAdapter } from "./adapters/loader.adapter";
import { invariantResponse } from "@epic-web/invariant";
import { useLoaderData } from "@remix-run/react";
import { geolocation } from "@vercel/edge";
import { json, type LoaderFunctionArgs, type MetaFunction, redirect } from "@vercel/remix";
import PageContainer from "~/components/layout/page-container";
import BreadcrumbList from "~/components/molecules/breadcrumb-list";
import ItemCard from "~/components/organisms/item-card";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	invariantResponse(data, "Meta - Missing search parameter");

	return [
		{ title: `${data.searchQuery} | Mercado Libre ${data.countryInfo.flag}` },
		{
			name: "description",
			content: `Compre ${data.searchQuery} ahora mismo.`
		}
	];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const geolocationInfo = geolocation(request);
	const url = new URL(request.url);
	const searchQuery = url.searchParams.get("search");

	if (!searchQuery) {
		return redirect("/");
	}

	const loaderData = await itemsRouteLoaderAdapter({ searchQuery, geolocationInfo });

	return json(loaderData);
};

export default function ItemsRoute() {
	const { categories, items, author, countryInfo } = useLoaderData<typeof loader>();

	return (
		<PageContainer>
			{author.name && <p className={"hidden"}>author name: {author.name}</p>}
			{author.lastName && <p className={"hidden"}>author last name: {author.lastName}</p>}

			<BreadcrumbList categoryList={categories} />

			<section className={"mb-20 rounded-md bg-white px-4"}>
				{items.map((item) => (
					<ItemCard
						id={item.id}
						key={item.id}
						title={item.title}
						amount={item.price.amount}
						currency={item.price.currency}
						decimals={item.price.decimals}
						imageURL={item.picture}
						freeShipping={item.free_shipping}
						sellerLocation={item.sellerLocation}
						countryLocale={countryInfo.locale}
					/>
				))}
			</section>
		</PageContainer>
	);
}
