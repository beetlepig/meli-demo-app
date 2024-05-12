import { invariantResponse } from "@epic-web/invariant";
import { searchScheme } from "~/routes/items/models";

const getSearch = async (searchQuery: string) => {
	const searchResponse = await fetch(
		`https://api.mercadolibre.com/sites/MCO/search?q=${searchQuery}&limit=4`
	);
	invariantResponse(searchResponse.ok, "Invalid search parameter");
	const searchResponseJSON = searchScheme.safeParse(await searchResponse.json());
	invariantResponse(
		searchResponseJSON.success,
		searchResponseJSON.error?.message ?? "Invalid search data object"
	);

	return searchResponseJSON;
};

export { getSearch };
