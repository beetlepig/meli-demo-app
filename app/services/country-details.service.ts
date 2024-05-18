import { invariantResponse } from "@epic-web/invariant";
import { countryDetailsScheme, endpointErrorScheme } from "~/models";

const getCountryDetails = async (countryCode: string) => {
	const countryDetailsResponse = await fetch(
		`https://api.mercadolibre.com/classified_locations/countries/${countryCode}`
	);
	if (!countryDetailsResponse.ok) {
		const countryDetailsResponseFailedJSON = endpointErrorScheme.safeParse(
			await countryDetailsResponse.json()
		);

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(countryDetailsResponseFailedJSON.data?.message ?? "Not a valid country", {
			status: countryDetailsResponse.status,
			statusText: countryDetailsResponse.statusText
		});
	}

	const countryDetailsResponseJSON = countryDetailsScheme.safeParse(
		await countryDetailsResponse.json()
	);
	invariantResponse(
		countryDetailsResponseJSON.success,
		countryDetailsResponseJSON.error?.message ?? "Invalid country object"
	);

	return countryDetailsResponseJSON;
};

export { getCountryDetails };
