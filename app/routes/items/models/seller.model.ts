import { z, type ZodType } from "zod";

interface ISellerDetails {
	id: number;
	nickname: string;
	country_id: string;
	address: {
		city: string;
		state: string;
	};
	user_type: string;
	site_id: string;
	permalink: string;
	seller_reputation: {
		level_id: string;
		power_seller_status: string | null;
		transactions: {
			period: string;
			total: number;
		};
	};
	status: {
		site_status: string;
	};
}

const sellerDetailsSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	country_id: z.string(),
	address: z.object({
		city: z.string(),
		state: z.string()
	}),
	user_type: z.string(),
	site_id: z.string(),
	permalink: z.string(),
	seller_reputation: z.object({
		level_id: z.string(),
		power_seller_status: z.string().or(z.null()),
		transactions: z.object({
			period: z.string(),
			total: z.number()
		})
	}),
	status: z.object({
		site_status: z.string()
	})
}) satisfies ZodType<ISellerDetails>;

export type { ISellerDetails };
export { sellerDetailsSchema };
