import { FunctionComponent } from "react";

const SearchBar: FunctionComponent = () => {
	return (
		<div className={"bg-yellow-500"}>
			<div className={"mx-auto grid max-w-7xl grid-cols-12 gap-3"}>
				<img
					className={"col-span-1 col-start-2 m-auto ml-0"}
					width={64}
					alt={"ML Logo"}
					src={"/images/logo_ml.png"}
				/>
				<div className={"col-span-9 col-start-3 h-16 py-3"}>
					<form action="/" className={"relative flex h-full"} role={"search"}>
						<label
							className={"absolute h-1 w-1 overflow-hidden whitespace-nowrap"}
							htmlFor={"mlsearch"}
						>
							Buscar en Mercado Libre:
						</label>
						<input
							className={"w-full rounded-sm px-3 text-base font-light"}
							type={"search"}
							id={"mlsearch"}
							name={"mlsearch"}
							placeholder={"Nunca dejes de buscar"}
						/>
						<button
							className={"absolute right-0 aspect-square h-full rounded-r-sm bg-gray-200"}
							type={"submit"}
						>
							<span className={"absolute h-1 w-1 overflow-hidden whitespace-nowrap"}>Search</span>
							<img
								alt={"search_icon"}
								src={"/icons/ic_search.png"}
								className={"m-auto"}
								width={16}
								height={16}
								aria-hidden={true}
							/>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export { SearchBar };
