import type { ISearchItem } from "./search-item.model";
import { z, type ZodType } from "zod";

interface ISearch {
	site_id: string;
	country_default_time_zone: string;
	query: string;
	results: ISearchItem[];
	filters: {
		id: string;
		name: string;
		type: string;
		values: {
			id: string;
			name: string;
			path_from_root?: {
				id: string;
				name: string;
			}[];
		}[];
	}[];
}

const searchScheme = z.object({
	site_id: z.string(),
	country_default_time_zone: z.string(),
	query: z.string(),
	results: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			condition: z.string(),
			thumbnail_id: z.string(),
			thumbnail: z.string(),
			currency_id: z.string(),
			price: z.number(),
			catalog_product_id: z.string().or(z.null()),
			shipping: z.object({
				store_pick_up: z.boolean(),
				free_shipping: z.boolean(),
				logistic_type: z.string(),
				mode: z.string(),
				tags: z.array(z.string()),
				benefits: z.unknown(),
				promise: z.unknown()
			}),
			seller: z.object({
				id: z.number(),
				nickname: z.string()
			})
		})
	),
	filters: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			type: z.string(),
			values: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					path_from_root: z
						.array(
							z.object({
								id: z.string(),
								name: z.string()
							})
						)
						.optional()
				})
			)
		})
	)
}) satisfies ZodType<ISearch>;

export type { ISearch };
export { searchScheme };
