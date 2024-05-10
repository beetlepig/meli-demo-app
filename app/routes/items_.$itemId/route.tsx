import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

const endpointErrorScheme = z.object({
	error: z.string(),
	message: z.string()
});
const itemDetailScheme = z.object({
	id: z.string(),
	title: z.string()
});
const itemDescriptionScheme = z.object({
	plain_text: z.string()
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	invariantResponse(data, "Meta - Missing itemId param");

	return [
		{ title: data.title },
		{
			name: "description",
			content: `${data.description.substring(0, 200).trim()}...`
		}
	];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
	const itemId = params.itemId;
	invariantResponse(itemId, "Missing itemId param");

	const itemDetails = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
	const itemDescription = await fetch(`https://api.mercadolibre.com/items/${itemId}/description`);

	if (!itemDetails.ok || !itemDescription.ok) {
		const itemDetailsFailedJSON = endpointErrorScheme.safeParse(await itemDetails.json());
		const itemDescriptionFailedJSON = endpointErrorScheme.safeParse(await itemDescription.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(
			(!itemDetails.ok
				? itemDetailsFailedJSON.data?.message
				: itemDescriptionFailedJSON.data?.message) ?? "Not a valid item",
			{
				status: !itemDetails.ok ? itemDetails.status : itemDescription.status,
				statusText: !itemDetails.ok ? itemDetails.statusText : itemDescription.statusText
			}
		);
	}

	const itemDetailsJSON = itemDetailScheme.safeParse(await itemDetails.json());
	invariantResponse(
		itemDetailsJSON.success,
		itemDetailsJSON.error?.message ?? "Invalid item detail object"
	);

	const itemDescriptionJSON = itemDescriptionScheme.safeParse(await itemDescription.json());
	invariantResponse(
		itemDescriptionJSON.success,
		itemDescriptionJSON.error?.message ?? "Invalid item description object"
	);

	return json({ ...itemDetailsJSON.data, description: itemDescriptionJSON.data.plain_text });
};

export default function ItemsIdRoute() {
	const data = useLoaderData<typeof loader>();

	console.log(data);

	return (
		<div>
			<p>detail</p>
		</div>
	);
}
