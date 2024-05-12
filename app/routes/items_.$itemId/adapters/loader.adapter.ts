import { promiseHash } from "remix-utils/promise";
import {
	getCategoryDetails,
	getItemDescription,
	getItemDetails
} from "~/routes/items_.$itemId/services";
import { getCurrencyDetails } from "~/services";

const itemsIdRouteLoaderAdapter = async (itemId: string) => {
	async function getItemDetailsAggregate(itemId: string) {
		const itemDetails = await getItemDetails(itemId);
		const categoryDetailsAndCurrencyDetails = await promiseHash({
			categoryDetails: getCategoryDetails(itemDetails.data.category_id),
			currencyDetails: getCurrencyDetails(itemDetails.data.currency_id)
		});

		return {
			itemDetails,
			categoryDetails: categoryDetailsAndCurrencyDetails.categoryDetails,
			currencyDetails: categoryDetailsAndCurrencyDetails.currencyDetails
		};
	}

	const loaderResponse = await promiseHash({
		itemDetailsAggregate: getItemDetailsAggregate(itemId),
		itemDescription: getItemDescription(itemId)
	});

	return {
		id: loaderResponse.itemDetailsAggregate.itemDetails.data.id,
		title: loaderResponse.itemDetailsAggregate.itemDetails.data.title,
		categories: loaderResponse.itemDetailsAggregate.categoryDetails.data.path_from_root.map(
			(category) => category.name
		),
		price: {
			currency: loaderResponse.itemDetailsAggregate.currencyDetails.data.id,
			amount: loaderResponse.itemDetailsAggregate.itemDetails.data.price,
			decimals: loaderResponse.itemDetailsAggregate.currencyDetails.data.decimal_places
		},
		picture: loaderResponse.itemDetailsAggregate.itemDetails.data.pictures[0].secure_url,
		condition: loaderResponse.itemDetailsAggregate.itemDetails.data.condition,
		free_shipping: loaderResponse.itemDetailsAggregate.itemDetails.data.shipping.free_shipping,
		description: loaderResponse.itemDescription.data.plain_text
	};
};

export { itemsIdRouteLoaderAdapter };
