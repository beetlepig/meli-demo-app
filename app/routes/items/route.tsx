import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs, type MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import BreadcrumbIcon from "app/components/atoms/icons/breadcrumb";
import { clsx } from "clsx/lite";
import { useMemo } from "react";
import { z, ZodType } from "zod";
import ItemCard from "~/components/organisms/item-card";

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
	currencies: { id: string; symbol: string }[];
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

interface ISearchResponse {
	site_id: string;
	country_default_time_zone: string;
	query: string;
	results: {
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
	}[];
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
		{ title: `${data.search} | Mercado Libre` },
		{
			name: "description",
			content: `Compre ${data.search} ahora mismo.`
		}
	];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const search = url.searchParams.get("search");

	if (!search) {
		return redirect("/");
	}

	const siteResponse = await fetch("https://api.mercadolibre.com/sites/MCO");
	invariantResponse(siteResponse.ok, "Invalid site");
	const siteResponseJSON = siteResponseScheme.safeParse(await siteResponse.json());
	invariantResponse(
		siteResponseJSON.success,
		siteResponseJSON.error?.message ?? "Invalid site data object"
	);

	const currenciesResponse = await Promise.allSettled(
		siteResponseJSON.data.currencies.map((currency) =>
			fetch(`https://api.mercadolibre.com/currencies/${currency.id}`)
		)
	);
	const currenciesResponseJSON = await Promise.all(
		currenciesResponse.map(async (currencyResponse) => {
			invariantResponse(
				currencyResponse.status === "fulfilled" && currencyResponse.value.ok,
				"Invalid currency"
			);
			const currencyJSON = currencyResponseScheme.safeParse(await currencyResponse.value.json());
			invariantResponse(
				currencyJSON.success,
				currencyJSON.error?.message ?? "Invalid currency data object"
			);
			return currencyJSON.data;
		})
	);

	const searchResponse = await fetch(
		`https://api.mercadolibre.com/sites/MCO/search?q=${search}&limit=4`
	);
	invariantResponse(searchResponse.ok, "Invalid search parameter");
	const searchResponseJSON = searchResponseScheme.safeParse(await searchResponse.json());
	invariantResponse(
		searchResponseJSON.success,
		searchResponseJSON.error?.message ?? "Invalid search data object"
	);

	return json({
		search,
		searchData: {
			categories:
				searchResponseJSON.data.filters
					.find((filter) => filter.id === "category")
					?.values.flatMap(
						(filterValue) => filterValue.path_from_root?.map((category) => category.name) ?? []
					) ?? [],
			items: searchResponseJSON.data.results.map((item) => {
				const currencyData = currenciesResponseJSON.find(
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
					free_shipping: item.shipping.free_shipping
				};
			})
		}
	});
};

export default function ItemsRoute() {
	const { searchData } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const loading = useMemo(() => navigation.state === "loading", [navigation.state]);

	return (
		<div
			className={clsx(
				"mx-auto grid max-w-7xl grid-cols-12 gap-3",
				loading && "opacity-40 transition-opacity"
			)}
		>
			<div className={"col-span-10 col-start-2"}>
				<ol className={"mb-4 mt-3"}>
					{searchData.categories.map((category, index) => (
						<li key={category} className={"inline text-sm font-light text-gray-700"}>
							<p
								className={
									index === searchData.categories.length - 1 ? "inline font-medium" : "inline"
								}
							>
								{category}
							</p>
							{index < searchData.categories.length - 1 && (
								<BreadcrumbIcon className={"mx-1 inline h-3 w-3"} stroke={"currentColor"} />
							)}
						</li>
					))}
				</ol>
				<section className={"mb-20 rounded-md bg-white px-4"}>
					{searchData.items.map((item) => (
						<ItemCard
							id={item.id}
							key={item.id}
							title={item.title}
							amount={item.price.amount}
							currency={item.price.currency}
							decimals={item.price.decimals}
							imageURL={item.picture}
							freeShipping={item.free_shipping}
						/>
					))}
				</section>
			</div>
		</div>
	);
}
