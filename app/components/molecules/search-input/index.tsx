import { type FunctionComponent, memo } from "react";

interface SearchInputProps {
	name: string;
	value?: string;
	onChange?: (value: string) => void;
}

const SearchInput: FunctionComponent<SearchInputProps> = ({ name, value, onChange }) => {
	return (
		<div className={"relative flex h-full w-full"}>
			<label className={"absolute h-1 w-1 overflow-hidden whitespace-nowrap"} htmlFor={name}>
				Buscar en Mercado Libre:
			</label>
			<input
				className={"w-full rounded px-3 text-base font-light"}
				value={value}
				onChange={(event) => {
					onChange?.(event.currentTarget.value);
				}}
				type={"search"}
				id={name}
				name={name}
				placeholder={"Nunca dejes de buscar"}
			/>
			<button
				className={"absolute right-0 aspect-square h-full rounded-r bg-gray-200"}
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
		</div>
	);
};

export default memo(SearchInput);
