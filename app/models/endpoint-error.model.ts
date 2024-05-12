import { z, type ZodType } from "zod";

interface IEndpointError {
	error: string;
	message: string;
}

const endpointErrorScheme = z.object({
	error: z.string(),
	message: z.string()
}) satisfies ZodType<IEndpointError>;

export type { IEndpointError };
export { endpointErrorScheme };
