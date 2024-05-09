import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "Mercado Libre" },
		{
			name: "description",
			content: "Todo lo que necesitas lo conseguís en un solo lugar, en Mercado Libre"
		}
	];
};

export default function Index() {
	return <div className={"contents"}></div>;
}
