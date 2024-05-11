import { type FunctionComponent, memo, useMemo } from "react";

interface ItemCardProps {
	title: string;
	amount: number;
	currency: string;
	decimals: number;
	imageURL: string;
	freeShipping: boolean;
}

const ItemCard: FunctionComponent<ItemCardProps> = ({
	title,
	amount,
	currency,
	decimals,
	imageURL,
	freeShipping
}) => {
	const formattedPrice = useMemo(
		() =>
			new Intl.NumberFormat("es-CO", {
				style: "currency",
				currency: currency,
				maximumFractionDigits: decimals
			}).format(amount),
		[amount, currency, decimals]
	);

	return (
		<div className={"flex border-b border-gray-100 py-4"}>
			<img
				className={"h-[180px] w-[180px] rounded object-contain"}
				width={180}
				height={180}
				alt={title}
				src={imageURL}
			/>
			<div className={"ml-4"}>
				<h3 className={"my-4 text-2xl font-light"}>
					<span className={"align-middle after:mr-3 after:content-['']"}>{formattedPrice}</span>
					{freeShipping && (
						<img
							width={18}
							height={18}
							alt={"Free Shipping"}
							className={"inline align-middle"}
							src={"/icons/ic_shipping.png"}
							srcSet="/icons/ic_shipping.png 1x,
  							/icons/ic_shipping@2x.png 2x"
						/>
					)}
				</h3>
				<h2 className={"text-lg font-light"}>{title}</h2>
			</div>
		</div>
	);
};

export default memo(ItemCard);