import { invariantResponse } from "@epic-web/invariant";
import { siteScheme } from "~/routes/items/models";

const getSite = async () => {
	const siteResponse = await fetch("https://api.mercadolibre.com/sites/MCO");
	invariantResponse(siteResponse.ok, "Invalid site");

	const siteResponseJSON = siteScheme.safeParse(await siteResponse.json());
	invariantResponse(
		siteResponseJSON.success,
		siteResponseJSON.error?.message ?? "Invalid site data object"
	);

	return siteResponseJSON;
};

export { getSite };
