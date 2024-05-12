import { z, type ZodType } from "zod";

interface ItemDescription {
	text: string;
	plain_text: string;
	last_updated: string;
	date_created: string;
	snapshot: {
		url: string;
		width: number;
		height: number;
		status: string;
	};
}
const itemDescriptionScheme = z.object({
	text: z.string(),
	plain_text: z.string(),
	last_updated: z.string(),
	date_created: z.string(),
	snapshot: z.object({
		url: z.string(),
		width: z.number(),
		height: z.number(),
		status: z.string()
	})
}) satisfies ZodType<ItemDescription>;

export type { ItemDescription };
export { itemDescriptionScheme };
