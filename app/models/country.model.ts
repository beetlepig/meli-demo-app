import { z, type ZodType } from "zod";

interface ICountryDetails {
	id: string;
	name: string;
	locale: string;
	currency_id: string;
	decimal_separator: string;
	thousands_separator: string;
	time_zone: string;
	geo_information?: unknown;
	states: {
		id: string;
		name: string;
	}[];
}

const countryDetailsScheme = z.object({
	id: z.string(),
	name: z.string(),
	locale: z.string(),
	currency_id: z.string(),
	decimal_separator: z.string(),
	thousands_separator: z.string(),
	time_zone: z.string(),
	geo_information: z.unknown(),
	states: z.array(
		z.object({
			id: z.string(),
			name: z.string()
		})
	)
}) satisfies ZodType<ICountryDetails>;

export type { ICountryDetails };
export { countryDetailsScheme };
