import { invariantResponse } from "@epic-web/invariant";
import { currencyScheme, endpointErrorScheme } from "~/models";

const getCurrencyDetails = async (currencyId: string) => {
	const currencyResponse = await fetch(`https://api.mercadolibre.com/currencies/${currencyId}`);
	if (!currencyResponse.ok) {
		const currencyResponseFailedJSON = endpointErrorScheme.safeParse(await currencyResponse.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(currencyResponseFailedJSON.data?.message ?? "Not a valid currency", {
			status: currencyResponse.status,
			statusText: currencyResponse.statusText
		});
	}
	const currencyResponseJSON = currencyScheme.safeParse(await currencyResponse.json());
	invariantResponse(
		currencyResponseJSON.success,
		currencyResponseJSON.error?.message ?? "Invalid currency object"
	);

	return currencyResponseJSON;
};

export { getCurrencyDetails };
