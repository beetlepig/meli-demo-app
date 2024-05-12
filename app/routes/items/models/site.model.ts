import type { ISiteCurrencies } from "./site-currencies.model";
import { z, type ZodType } from "zod";

interface ISite {
	id: string;
	name: string;
	country_id: string;
	sale_fees_mode: string;
	mercadopago_version: number;
	default_currency_id: string;
	immediate_payment: string;
	payment_method_ids: string[];
	settings: {
		identification_types: string[];
		taxpayer_types: string[];
		identification_types_rules:
			| {
					identification_type: string;
					rules: {
						enabled_taxpayer_types: string[];
						begins_with: string;
						type: string;
						min_length: number;
						max_length: number;
					}[];
			  }[]
			| null;
	};
	currencies: ISiteCurrencies[];
	categories: { id: string; name: string }[];
	channels: string[];
}

const siteScheme = z.object({
	id: z.string(),
	name: z.string(),
	country_id: z.string(),
	sale_fees_mode: z.string(),
	mercadopago_version: z.number(),
	default_currency_id: z.string(),
	immediate_payment: z.string(),
	payment_method_ids: z.array(z.string()),
	settings: z.object({
		identification_types: z.array(z.string()),
		taxpayer_types: z.array(z.string()),
		identification_types_rules: z
			.array(
				z.object({
					identification_type: z.string(),
					rules: z.array(
						z.object({
							enabled_taxpayer_types: z.array(z.string()),
							begins_with: z.string(),
							type: z.string(),
							min_length: z.number(),
							max_length: z.number()
						})
					)
				})
			)
			.or(z.null())
	}),
	currencies: z.array(
		z.object({
			id: z.string(),
			symbol: z.string()
		})
	),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string()
		})
	),
	channels: z.array(z.string())
}) satisfies ZodType<ISite>;

export type { ISite };
export { siteScheme };
