import { z, type ZodType } from "zod";

interface ICategoryDetails {
	id: string;
	name: string;
	picture: string | null;
	permalink: string | null;
	total_items_in_this_category: number;
	path_from_root: {
		id: string;
		name: string;
	}[];
	children_categories: {
		id: string;
		name: string;
		total_items_in_this_category: number;
	}[];
	attribute_types: string;
	settings?: unknown;
	channels_settings?: unknown;
	meta_categ_id: null;
	attributable: boolean;
	date_created: string;
}

const categoryDetailsScheme = z.object({
	id: z.string(),
	name: z.string(),
	picture: z.string().or(z.null()),
	permalink: z.string().or(z.null()),
	total_items_in_this_category: z.number(),
	path_from_root: z.array(
		z.object({
			id: z.string(),
			name: z.string()
		})
	),
	children_categories: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			total_items_in_this_category: z.number()
		})
	),
	attribute_types: z.string(),
	settings: z.unknown(),
	channels_settings: z.unknown(),
	meta_categ_id: z.null(),
	attributable: z.boolean(),
	date_created: z.string()
}) satisfies ZodType<ICategoryDetails>;

export type { ICategoryDetails };
export { categoryDetailsScheme };
