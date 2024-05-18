import { useMemo } from "react";

interface UseFormatPriceArgs {
	locale: string;
	currency: string;
	decimals: number;
	amount: number;
}

const useFormatPrice = ({ currency, decimals, amount, locale }: UseFormatPriceArgs) => {
	return useMemo(
		() =>
			new Intl.NumberFormat(locale, {
				style: "currency",
				currency: currency,
				maximumFractionDigits: decimals
			}).format(amount),
		[amount, currency, decimals, locale]
	);
};

export { useFormatPrice };
