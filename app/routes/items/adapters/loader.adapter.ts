import { getSearch, getSite, getSiteCurrencies, getSellersDetail } from "../services";
import { promiseHash } from "remix-utils/promise";

const itemsRouteLoaderAdapter = async ({ searchQuery }: { searchQuery: string }) => {
	async function getSiteAndSiteCurrencies() {
		const site = await getSite();
		const siteCurrencies = await getSiteCurrencies(site.data.currencies);

		return { site, siteCurrencies };
	}
	async function getSearchAndSellersDetail(searchQuery: string) {
		const search = await getSearch(searchQuery);
		const sellersLocation = await getSellersDetail(search.data.results);

		return { search, sellersLocation };
	}

	const loaderResponse = await promiseHash({
		siteAndSiteCurrencies: getSiteAndSiteCurrencies(),
		searchAndSellersLocation: getSearchAndSellersDetail(searchQuery)
	});

	return {
		searchQuery,
		categories:
			loaderResponse.searchAndSellersLocation.search.data.filters
				.find((filter) => filter.id === "category")
				?.values.flatMap(
					(filterValue) => filterValue.path_from_root?.map((category) => category.name) ?? []
				) ?? [],
		items: loaderResponse.searchAndSellersLocation.search.data.results.map((item) => {
			const currencyData = loaderResponse.siteAndSiteCurrencies.siteCurrencies.find(
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
					loaderResponse.searchAndSellersLocation.sellersLocation.find(
						(sellerDetail) => sellerDetail.data.id === item.seller.id
					)?.data.address.city ?? null
			};
		})
	};
};

export { itemsRouteLoaderAdapter };
