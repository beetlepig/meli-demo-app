import { invariantResponse } from "@epic-web/invariant";
import { endpointErrorScheme } from "~/models";
import { categoryDetailsScheme } from "~/routes/items_.$itemId/models";

const getCategoryDetails = async (categoryId: string) => {
	const categoryDetailsResponse = await fetch(
		`https://api.mercadolibre.com/categories/${categoryId}`
	);

	if (!categoryDetailsResponse.ok) {
		const categoryDetailsFailedJSON = endpointErrorScheme.safeParse(
			await categoryDetailsResponse.json()
		);

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(categoryDetailsFailedJSON.data?.message ?? "Not a valid category", {
			status: categoryDetailsResponse.status,
			statusText: categoryDetailsResponse.statusText
		});
	}

	const categoryDetailsResponseJSON = categoryDetailsScheme.safeParse(
		await categoryDetailsResponse.json()
	);
	invariantResponse(
		categoryDetailsResponseJSON.success,
		categoryDetailsResponseJSON.error?.message ?? "Invalid category object"
	);

	return categoryDetailsResponseJSON;
};

export { getCategoryDetails };
