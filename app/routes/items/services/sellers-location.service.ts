import { type ISearchItem, sellerDetailsSchema } from "../models";
import { invariant, invariantResponse } from "@epic-web/invariant";

const getSellersDetail = async (items: ISearchItem[]) => {
	return Promise.all(
		items.map(async (item) => {
			const sellerDetailsResponse = await fetch(
				`https://api.mercadolibre.com/users/${item.seller.id}`
			);
			invariant(sellerDetailsResponse.ok, "Invalid seller");

			const sellerDetailsResponseJSON = sellerDetailsSchema.safeParse(
				await sellerDetailsResponse.json()
			);
			invariantResponse(
				sellerDetailsResponseJSON.success,
				sellerDetailsResponseJSON.error?.message ?? "Invalid seller data object"
			);

			return sellerDetailsResponseJSON;
		})
	);
};

export { getSellersDetail };
