import { useMemo } from "react";

interface UseFormatPriceArgs {
	currency: string;
	decimals: number;
	amount: number;
}

const useFormatPrice = ({ currency, decimals, amount }: UseFormatPriceArgs) => {
	return useMemo(
		() =>
			new Intl.NumberFormat("es-CO", {
				style: "currency",
				currency: currency,
				maximumFractionDigits: decimals
			}).format(amount),
		[amount, currency, decimals]
	);
};

export { useFormatPrice };
