import type { Geo } from "@vercel/edge";
import {
	getCategoryDetails,
	getItemDescription,
	getItemDetails
} from "~/routes/items_.$itemId/services";
import { getAuthorSignature, getCountryDetails, getCurrencyDetails } from "~/services";
import { getSiteLocaleInfo } from "~/utils";

const itemsIdRouteLoaderAdapter = async ({
	itemId,
	geolocationInfo: { country }
}: {
	itemId: string;
	geolocationInfo: Geo;
}) => {
	const siteLocaleInfo = getSiteLocaleInfo(country);

	async function getItemDetailsAggregate(itemId: string) {
		const itemDetails = await getItemDetails(itemId);
		const categoryDetailsAndCurrencyDetails = await Promise.all([
			getCategoryDetails(itemDetails.data.category_id),
			getCurrencyDetails(itemDetails.data.currency_id)
		]);

		return {
			itemDetails,
			categoryDetails: categoryDetailsAndCurrencyDetails[0],
			currencyDetails: categoryDetailsAndCurrencyDetails[1]
		};
	}

	const loaderResponse = await Promise.all([
		getItemDetailsAggregate(itemId),
		getItemDescription(itemId),
		getCountryDetails(siteLocaleInfo.countryCode)
	]);

	const authorSignature = getAuthorSignature();

	return {
		author: authorSignature,
		countryInfo: {
			locale: loaderResponse[2].data.locale.replaceAll("_", "-"),
			flag: siteLocaleInfo.flag
		},
		item: {
			id: loaderResponse[0].itemDetails.data.id,
			title: loaderResponse[0].itemDetails.data.title,
			categories: loaderResponse[0].categoryDetails.data.path_from_root.map(
				(category) => category.name
			),
			price: {
				currency: loaderResponse[0].currencyDetails.data.id,
				amount: loaderResponse[0].itemDetails.data.price,
				decimals: loaderResponse[0].currencyDetails.data.decimal_places
			},
			picture: loaderResponse[0].itemDetails.data.pictures[0].secure_url,
			condition: loaderResponse[0].itemDetails.data.condition,
			free_shipping: loaderResponse[0].itemDetails.data.shipping.free_shipping,
			description:
				loaderResponse[1]?.data.plain_text ?? "El vendedor no incluyó una descripción del producto"
		}
	};
};

export { itemsIdRouteLoaderAdapter };
