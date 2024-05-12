import { invariant, invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs, type MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { z, ZodType } from "zod";
import PageContainer from "~/components/layout/page-container";
import BreadcrumbList from "~/components/molecules/breadcrumb-list";
import ItemCard from "~/components/organisms/item-card";

interface ISellerDetailsResponse {
	id: number;
	nickname: string;
	country_id: string;
	address: {
		city: string;
		state: string;
	};
	user_type: string;
	site_id: string;
	permalink: string;
	seller_reputation: {
		level_id: string;
		power_seller_status: string | null;
		transactions: {
			period: string;
			total: number;
		};
	};
	status: {
		site_status: string;
	};
}
const sellerDetailsResponseSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	country_id: z.string(),
	address: z.object({
		city: z.string(),
		state: z.string()
	}),
	user_type: z.string(),
	site_id: z.string(),
	permalink: z.string(),
	seller_reputation: z.object({
		level_id: z.string(),
		power_seller_status: z.string().or(z.null()),
		transactions: z.object({
			period: z.string(),
			total: z.number()
		})
	}),
	status: z.object({
		site_status: z.string()
	})
}) satisfies ZodType<ISellerDetailsResponse>;

interface ICurrencyResponse {
	id: string;
	symbol: string;
	description: string;
	decimal_places: number;
}
const currencyResponseScheme = z.object({
	id: z.string(),
	symbol: z.string(),
	description: z.string(),
	decimal_places: z.number()
}) satisfies ZodType<ICurrencyResponse>;

interface ISiteCurrencies {
	id: string;
	symbol: string;
}
interface ISiteResponse {
	id: string;
	name: string;
	country_id: string;
	sale_fees_mode: string;
	mercadopago_version: number;
	default_currency_id: string;
	immediate_payment: string;
	payment_method_ids: string[];
	settings: {
		identification_types: string[];
		taxpayer_types: string[];
		identification_types_rules:
			| {
					identification_type: string;
					rules: {
						enabled_taxpayer_types: string[];
						begins_with: string;
						type: string;
						min_length: number;
						max_length: number;
					}[];
			  }[]
			| null;
	};
	currencies: ISiteCurrencies[];
	categories: { id: string; name: string }[];
	channels: string[];
}
const siteResponseScheme = z.object({
	id: z.string(),
	name: z.string(),
	country_id: z.string(),
	sale_fees_mode: z.string(),
	mercadopago_version: z.number(),
	default_currency_id: z.string(),
	immediate_payment: z.string(),
	payment_method_ids: z.array(z.string()),
	settings: z.object({
		identification_types: z.array(z.string()),
		taxpayer_types: z.array(z.string()),
		identification_types_rules: z
			.array(
				z.object({
					identification_type: z.string(),
					rules: z.array(
						z.object({
							enabled_taxpayer_types: z.array(z.string()),
							begins_with: z.string(),
							type: z.string(),
							min_length: z.number(),
							max_length: z.number()
						})
					)
				})
			)
			.or(z.null())
	}),
	currencies: z.array(
		z.object({
			id: z.string(),
			symbol: z.string()
		})
	),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string()
		})
	),
	channels: z.array(z.string())
}) satisfies ZodType<ISiteResponse>;

interface ISearchItem {
	id: string;
	title: string;
	condition: string;
	thumbnail_id: string;
	thumbnail: string;
	currency_id: string;
	price: number;
	catalog_product_id: string | null;
	shipping: {
		store_pick_up: boolean;
		free_shipping: boolean;
		logistic_type: string;
		mode: string;
		tags: string[];
		benefits?: unknown;
		promise?: unknown;
	};
	seller: {
		id: number;
		nickname: string;
	};
}
interface ISearchResponse {
	site_id: string;
	country_default_time_zone: string;
	query: string;
	results: ISearchItem[];
	filters: {
		id: string;
		name: string;
		type: string;
		values: {
			id: string;
			name: string;
			path_from_root?: {
				id: string;
				name: string;
			}[];
		}[];
	}[];
}
const searchResponseScheme = z.object({
	site_id: z.string(),
	country_default_time_zone: z.string(),
	query: z.string(),
	results: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			condition: z.string(),
			thumbnail_id: z.string(),
			thumbnail: z.string(),
			currency_id: z.string(),
			price: z.number(),
			catalog_product_id: z.string().or(z.null()),
			shipping: z.object({
				store_pick_up: z.boolean(),
				free_shipping: z.boolean(),
				logistic_type: z.string(),
				mode: z.string(),
				tags: z.array(z.string()),
				benefits: z.unknown(),
				promise: z.unknown()
			}),
			seller: z.object({
				id: z.number(),
				nickname: z.string()
			})
		})
	),
	filters: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			type: z.string(),
			values: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					path_from_root: z
						.array(
							z.object({
								id: z.string(),
								name: z.string()
							})
						)
						.optional()
				})
			)
		})
	)
}) satisfies ZodType<ISearchResponse>;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	invariantResponse(data, "Meta - Missing search parameter");

	return [
		{ title: `${data.searchQuery} | Mercado Libre` },
		{
			name: "description",
			content: `Compre ${data.searchQuery} ahora mismo.`
		}
	];
};
const getSearch = async (searchQuery: string) => {
	const searchResponse = await fetch(
		`https://api.mercadolibre.com/sites/MCO/search?q=${searchQuery}&limit=4`
	);
	invariantResponse(searchResponse.ok, "Invalid search parameter");
	const searchResponseJSON = searchResponseScheme.safeParse(await searchResponse.json());
	invariantResponse(
		searchResponseJSON.success,
		searchResponseJSON.error?.message ?? "Invalid search data object"
	);

	return searchResponseJSON;
};
const getSellersLocation = async (items: ISearchItem[]) => {
	return Promise.all(
		items.map(async (item) => {
			const sellerDetailsResponse = await fetch(
				`https://api.mercadolibre.com/users/${item.seller.id}`
			);
			invariant(sellerDetailsResponse.ok, "Invalid seller");

			const sellerDetailsResponseJSON = sellerDetailsResponseSchema.safeParse(
				await sellerDetailsResponse.json()
			);
			invariantResponse(
				sellerDetailsResponseJSON.success,
				sellerDetailsResponseJSON.error?.message ?? "Invalid seller data object"
			);

			return {
				sellerId: sellerDetailsResponseJSON.data.id,
				location: sellerDetailsResponseJSON.data.address.city
			};
		})
	);
};
const getSite = async () => {
	const siteResponse = await fetch("https://api.mercadolibre.com/sites/MCO");
	invariantResponse(siteResponse.ok, "Invalid site");

	const siteResponseJSON = siteResponseScheme.safeParse(await siteResponse.json());
	invariantResponse(
		siteResponseJSON.success,
		siteResponseJSON.error?.message ?? "Invalid site data object"
	);

	return siteResponseJSON;
};
const getSiteCurrencies = async (currencies: ISiteCurrencies[]) => {
	const currenciesResponse = await Promise.all(
		currencies.map((currency) => fetch(`https://api.mercadolibre.com/currencies/${currency.id}`))
	);

	return await Promise.all(
		currenciesResponse.map(async (currencyResponse) => {
			invariantResponse(currencyResponse.ok, "Invalid currency");
			const currencyJSON = currencyResponseScheme.safeParse(await currencyResponse.json());
			invariantResponse(
				currencyJSON.success,
				currencyJSON.error?.message ?? "Invalid currency data object"
			);
			return currencyJSON.data;
		})
	);
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const searchQuery = url.searchParams.get("search");

	if (!searchQuery) {
		return redirect("/");
	}

	async function getSiteAndSiteCurrencies() {
		const site = await getSite();
		const siteCurrencies = await getSiteCurrencies(site.data.currencies);

		return { site, siteCurrencies };
	}
	async function getSearchAndSellersLocation(searchQuery: string) {
		const search = await getSearch(searchQuery);
		const sellersLocation = await getSellersLocation(search.data.results);

		return { search, sellersLocation };
	}

	const loaderResponse = await promiseHash({
		siteAndSiteCurrencies: getSiteAndSiteCurrencies(),
		searchAndSellersLocation: getSearchAndSellersLocation(searchQuery)
	});

	return json({
		searchQuery,
		categories:
			loaderResponse.searchAndSellersLocation.search.data.filters
				.find((filter) => filter.id === "category")
				?.values.flatMap(
					(filterValue) => filterValue.path_from_root?.map((category) => category.name) ?? []
				) ?? [],
		items: loaderResponse.searchAndSellersLocation.search.data.results.map((item) => {
			const currencyData = loaderResponse.siteAndSiteCurrencies.siteCurrencies.find(
				(currency) => currency.id === item.currency_id
			);
			return {
				id: item.id,
				title: item.title,
				price: {
					currency: currencyData?.id ?? item.currency_id,
					amount: item.price,
					decimals: currencyData?.decimal_places ?? 0
				},
				picture: `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.webp`,
				condition: item.condition,
				free_shipping: item.shipping.free_shipping,
				sellerLocation:
					loaderResponse.searchAndSellersLocation.sellersLocation.find(
						(sellerDetail) => sellerDetail.sellerId === item.seller.id
					)?.location ?? null
			};
		})
	});
};

export default function ItemsRoute() {
	const { categories, items } = useLoaderData<typeof loader>();

	return (
		<PageContainer>
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
					/>
				))}
			</section>
		</PageContainer>
	);
}
