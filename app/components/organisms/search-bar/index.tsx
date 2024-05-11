import { Form, Link } from "@remix-run/react";
import { type FunctionComponent, memo, useEffect, useState } from "react";
import Logo from "~/components/atoms/logo";
import SearchInput from "~/components/molecules/search-input";

interface SearchBarProps {
	value?: string;
}

const SearchBar: FunctionComponent<SearchBarProps> = ({ value }) => {
	const [searchValue, setSearchValue] = useState(value ?? "");

	useEffect(() => {
		setSearchValue(value ?? "");
	}, [value]);

	return (
		<div className={"bg-yellow-500 px-3 sm:px-0"}>
			<div className={"mx-auto grid max-w-7xl grid-cols-12 gap-3"}>
				<Link to={"/"} className={"col-span-2 m-auto ml-0 py-1 sm:col-span-1 sm:col-start-2"}>
					<Logo size={54} />
				</Link>
				<div className={"col-span-10 col-start-3 h-14 py-2 sm:col-span-9"}>
					<Form action="items" className={"h-full"} role={"search"}>
						<SearchInput name={"search"} value={searchValue} onChange={setSearchValue} />
					</Form>
				</div>
			</div>
		</div>
	);
};

export default memo(SearchBar);
