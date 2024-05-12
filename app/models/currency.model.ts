import { z, type ZodType } from "zod";

interface ICurrencyDetails {
	id: string;
	symbol: string;
	description: string;
	decimal_places: number;
}

const currencyScheme = z.object({
	id: z.string(),
	symbol: z.string(),
	description: z.string(),
	decimal_places: z.number()
}) satisfies ZodType<ICurrencyDetails>;

export type { ICurrencyDetails };
export { currencyScheme };
