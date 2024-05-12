import { invariantResponse } from "@epic-web/invariant";
import { endpointErrorScheme, itemDetailScheme } from "~/models";

const getItemDetails = async (itemId: string) => {
	const itemDetails = await fetch(`https://api.mercadolibre.com/items/${itemId}`);

	if (!itemDetails.ok) {
		const itemDetailsFailedJSON = endpointErrorScheme.safeParse(await itemDetails.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(itemDetailsFailedJSON.data?.message ?? "Not a valid item", {
			status: itemDetails.status,
			statusText: itemDetails.statusText
		});
	}

	const itemDetailsJSON = itemDetailScheme.safeParse(await itemDetails.json());
	invariantResponse(
		itemDetailsJSON.success,
		itemDetailsJSON.error?.message ?? "Invalid item detail object"
	);

	return itemDetailsJSON;
};

export { getItemDetails };
