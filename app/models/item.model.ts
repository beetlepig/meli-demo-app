import { z, type ZodType } from "zod";

interface ISearchItem {
	id: string;
	title: string;
	condition: string;
	thumbnail_id: string;
	thumbnail: string;
	currency_id: string;
	price: number;
	catalog_product_id: string | null;
	shipping: {
		store_pick_up: boolean;
		free_shipping: boolean;
		logistic_type: string | null;
		mode: string;
		tags: string[];
		benefits?: unknown;
		promise?: unknown;
	};
	seller: {
		id: number;
		nickname: string;
	};
}

interface IItemDetail {
	id: string;
	title: string;
	category_id: string;
	price: number;
	currency_id: string;
	condition: string;
	pictures: {
		id: string;
		url: string;
		secure_url: string;
		size: string;
		max_size: string;
		quality: string;
	}[];
	shipping: {
		mode: string;
		methods: unknown[];
		tags: string[];
		dimensions: null;
		local_pick_up: boolean;
		free_shipping: boolean;
		logistic_type: string | null;
		store_pick_up: boolean;
	};
}
const itemDetailScheme = z.object({
	id: z.string(),
	title: z.string(),
	category_id: z.string(),
	price: z.number(),
	currency_id: z.string(),
	condition: z.string(),
	pictures: z.array(
		z.object({
			id: z.string(),
			url: z.string(),
			secure_url: z.string(),
			size: z.string(),
			max_size: z.string(),
			quality: z.string()
		})
	),
	shipping: z.object({
		mode: z.string(),
		methods: z.array(z.unknown()),
		tags: z.array(z.string()),
		dimensions: z.null(),
		local_pick_up: z.boolean(),
		free_shipping: z.boolean(),
		logistic_type: z.string().or(z.null()),
		store_pick_up: z.boolean()
	})
}) satisfies ZodType<IItemDetail>;

export type { ISearchItem, IItemDetail };
export { itemDetailScheme };
