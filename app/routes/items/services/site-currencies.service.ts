import type { ISiteCurrencies } from "~/routes/items/models";
import { getCurrencyDetails } from "~/services";

const getSiteCurrencies = (currencies: ISiteCurrencies[]) => {
	return Promise.all(currencies.map((currency) => getCurrencyDetails(currency.id)));
};

export { getSiteCurrencies };
