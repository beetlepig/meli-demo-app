import { getSearch, getSite, getSiteCurrencies, getSellersDetail } from "../services";
import type { Geo } from "@vercel/edge";
import { getAuthorSignature, getCountryDetails } from "~/services";
import { getSiteName } from "~/utils";

const itemsRouteLoaderAdapter = async ({
	searchQuery,
	geolocationInfo: { country = "AR", flag = "🇦🇷" }
}: {
	searchQuery: string;
	geolocationInfo: Geo;
}) => {
	const siteName = getSiteName(country);

	async function getSiteAndSiteCurrencies(siteName: string) {
		const site = await getSite(siteName);
		const siteCurrencies = await getSiteCurrencies(site.data.currencies);

		return { site, siteCurrencies };
	}
	async function getSearchAndSellersDetail(siteName: string, searchQuery: string) {
		const search = await getSearch(siteName, searchQuery);
		const sellersLocation = await getSellersDetail(search.data.results);

		return { search, sellersLocation };
	}

	const loaderResponse = await Promise.all([
		getSiteAndSiteCurrencies(siteName),
		getCountryDetails(country),
		getSearchAndSellersDetail(siteName, searchQuery)
	]);

	const authorSignature = getAuthorSignature();

	return {
		searchQuery,
		author: authorSignature,
		countryInfo: { locale: loaderResponse[1].data.locale.replaceAll("_", "-"), flag: flag },
		categories:
			loaderResponse[2].search.data.filters
				.find((filter) => filter.id === "category")
				?.values.flatMap(
					(filterValue) => filterValue.path_from_root?.map((category) => category.name) ?? []
				) ?? [],
		items: loaderResponse[2].search.data.results.map((item) => {
			const currencyData = loaderResponse[0].siteCurrencies.find(
				(currency) => currency.data.id === item.currency_id
			);
			return {
				id: item.id,
				title: item.title,
				price: {
					currency: currencyData?.data.id ?? item.currency_id,
					amount: item.price,
					decimals: currencyData?.data.decimal_places ?? 0
				},
				picture: `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.webp`,
				condition: item.condition,
				free_shipping: item.shipping.free_shipping,
				sellerLocation:
					loaderResponse[2].sellersLocation.find(
						(sellerDetail) => sellerDetail.data.id === item.seller.id
					)?.data.address.city ?? null
			};
		})
	};
};

export { itemsRouteLoaderAdapter };
