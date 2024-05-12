import { invariantResponse } from "@epic-web/invariant";
import { endpointErrorScheme } from "~/models";
import { itemDescriptionScheme } from "~/routes/items_.$itemId/models";

const getItemDescription = async (itemId: string) => {
	const itemDescription = await fetch(`https://api.mercadolibre.com/items/${itemId}/description`);
	if (!itemDescription.ok) {
		const itemDescriptionFailedJSON = endpointErrorScheme.safeParse(await itemDescription.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(itemDescriptionFailedJSON.data?.message ?? "Not a valid item", {
			status: itemDescription.status,
			statusText: itemDescription.statusText
		});
	}
	const itemDescriptionJSON = itemDescriptionScheme.safeParse(await itemDescription.json());
	invariantResponse(
		itemDescriptionJSON.success,
		itemDescriptionJSON.error?.message ?? "Invalid item description object"
	);

	return itemDescriptionJSON;
};

export { getItemDescription };
