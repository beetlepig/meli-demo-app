import { invariantResponse } from "@epic-web/invariant";
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";
import Button from "~/components/atoms/Button";
import PageContainer from "~/components/layout/page-container";
import BreadcrumbList from "~/components/molecules/breadcrumb-list";
import useFormatPrice from "~/hooks/format-price";
import { itemsIdRouteLoaderAdapter } from "~/routes/items_.$itemId/adapters/loader.adapter";

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

	const loaderData = await itemsIdRouteLoaderAdapter(itemId);

	return json(loaderData);
};

export default function ItemsIdRoute() {
	const data = useLoaderData<typeof loader>();
	const formattedPrice = useFormatPrice({
		currency: data.price.currency,
		decimals: data.price.decimals,
		amount: data.price.amount
	});

	return (
		<PageContainer>
			<BreadcrumbList categoryList={data.categories} />

			<section className={"mb-20 grid grid-cols-10 gap-3 rounded-none bg-white lg:rounded-sm"}>
				<div className={"col-span-10 space-y-8 pb-8 pl-8 pr-8 pt-8 lg:col-span-7 lg:pr-0"}>
					<div className={"space-y-4"}>
						<h6 className={"text-sm font-light text-gray-800 lg:hidden"}>
							{data.condition === "new" ? "Nuevo" : "Usado"}
						</h6>
						<h1 className={"text-2xl font-semibold lg:hidden"}>{data.title}</h1>
					</div>

					<img
						src={data.picture}
						alt={data.title}
						className={"max-h-[680px] object-contain"}
						width={680}
					/>
				</div>
				<div className={"col-span-10 space-y-4 pb-8 pl-8 pr-8 pt-8 lg:col-span-3 lg:pl-0"}>
					<h6 className={"hidden text-sm font-light text-gray-800 lg:block"}>
						{data.condition === "new" ? "Nuevo" : "Usado"}
					</h6>
					<div className={"space-y-8"}>
						<h1 className={"hidden text-2xl font-semibold lg:block"}>{data.title}</h1>
						<h2 className={"text-4xl"}>{formattedPrice}</h2>
						<Button />
					</div>
				</div>
				<div className={"col-span-10 space-y-8 pb-8 pl-8 pr-8 pt-8 lg:col-span-7 lg:pr-0"}>
					<h5 className={"text-2xl"}>Descripción del producto</h5>
					<p className={"text-base font-light text-gray-700"}>{data.description}</p>
				</div>
			</section>
		</PageContainer>
	);
}
