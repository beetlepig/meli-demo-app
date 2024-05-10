import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z, ZodType } from "zod";

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

// TODO: Pasar eso al dominio y evitar repiticion
interface ICurrencyResponse {
	id: string;
	symbol: string;
	description: string;
	decimal_places: number;
}
const currencyResponseScheme = z.object({
	id: z.string(),
	symbol: z.string(),
	description: z.string(),
	decimal_places: z.number()
}) satisfies ZodType<ICurrencyResponse>;

const endpointErrorScheme = z.object({
	error: z.string(),
	message: z.string()
});
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
		logistic_type: z.string(),
		store_pick_up: z.boolean()
	})
});
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

	const categoryResponse = await fetch(
		`https://api.mercadolibre.com/categories/${itemDetailsJSON.data.category_id}`
	);
	if (!categoryResponse.ok) {
		const currencyResponseFailedJSON = endpointErrorScheme.safeParse(await categoryResponse.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(currencyResponseFailedJSON.data?.message ?? "Not a valid category", {
			status: categoryResponse.status,
			statusText: categoryResponse.statusText
		});
	}
	const categoryResponseJSON = categoryDetailsScheme.safeParse(await categoryResponse.json());
	invariantResponse(
		categoryResponseJSON.success,
		categoryResponseJSON.error?.message ?? "Invalid category object"
	);

	const currencyResponse = await fetch(
		`https://api.mercadolibre.com/currencies/${itemDetailsJSON.data.currency_id}`
	);
	if (!currencyResponse.ok) {
		const currencyResponseFailedJSON = endpointErrorScheme.safeParse(await currencyResponse.json());

		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Response(currencyResponseFailedJSON.data?.message ?? "Not a valid currency", {
			status: currencyResponse.status,
			statusText: currencyResponse.statusText
		});
	}
	const currencyResponseJSON = currencyResponseScheme.safeParse(await currencyResponse.json());
	invariantResponse(
		currencyResponseJSON.success,
		currencyResponseJSON.error?.message ?? "Invalid currency object"
	);

	return json({
		id: itemDetailsJSON.data.id,
		title: itemDetailsJSON.data.title,
		categories: categoryResponseJSON.data.path_from_root.map((category) => category.name),
		price: {
			currency: currencyResponseJSON.data.id,
			amount: itemDetailsJSON.data.price,
			decimals: currencyResponseJSON.data.decimal_places
		},
		picture: itemDetailsJSON.data.pictures[0].secure_url,
		condition: itemDetailsJSON.data.condition,
		free_shipping: itemDetailsJSON.data.shipping.free_shipping,
		description: itemDescriptionJSON.data.plain_text
	});
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
