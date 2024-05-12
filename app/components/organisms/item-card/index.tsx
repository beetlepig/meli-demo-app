import { Link } from "@remix-run/react";
import { type FunctionComponent, memo } from "react";
import useFormatPrice from "~/hooks/format-price";

interface ItemCardProps {
	id: string;
	title: string;
	amount: number;
	currency: string;
	decimals: number;
	imageURL: string;
	freeShipping: boolean;
	sellerLocation: string | null;
}

const ItemCard: FunctionComponent<ItemCardProps> = ({
	id,
	title,
	amount,
	currency,
	decimals,
	imageURL,
	freeShipping,
	sellerLocation
}) => {
	const formattedPrice = useFormatPrice({
		currency: currency,
		decimals: decimals,
		amount: amount
	});

	return (
		<div className={"grid grid-cols-10 border-b border-gray-100 py-4"}>
			<Link to={`/items/${id}`} prefetch={"intent"} className={"contents"}>
				<img
					className={"col-span-3 h-[180px] w-[180px] rounded object-contain md:col-span-2"}
					width={180}
					height={180}
					alt={title}
					src={imageURL}
				/>
			</Link>
			<div className={"col-span-7 ml-4 md:col-span-6"}>
				<Link to={`/items/${id}`} prefetch={"intent"} className={"contents"}>
					<h3 className={"my-4 text-2xl font-light"}>
						<span className={"align-middle after:mr-3 after:content-['']"}>{formattedPrice}</span>
						{freeShipping && (
							<img
								width={18}
								height={18}
								alt={"Free Shipping"}
								className={"inline max-h-[180px] align-middle"}
								src={"/icons/ic_shipping.png"}
								srcSet="/icons/ic_shipping.png 1x,
  							/icons/ic_shipping@2x.png 2x"
							/>
						)}
					</h3>
				</Link>
				<Link to={`/items/${id}`} title={title} prefetch={"intent"}>
					<h2 className={"text-lg font-light"}>{title}</h2>
				</Link>
				<h5 className={"col-span-2 my-4 text-sm font-light text-gray-800 md:hidden"}>
					{sellerLocation}
				</h5>
			</div>
			<h5 className={"col-span-2 my-6 hidden text-sm font-light text-gray-800 md:block"}>
				{sellerLocation}
			</h5>
		</div>
	);
};

export default memo(ItemCard);
