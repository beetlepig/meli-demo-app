import { useNavigation } from "@remix-run/react";
import { clsx } from "clsx";
import { type FunctionComponent, type ReactNode, useMemo } from "react";

const PageContainer: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const navigation = useNavigation();
	const loading = useMemo(() => navigation.state === "loading", [navigation.state]);

	return (
		<div
			className={clsx(
				"mx-auto grid max-w-7xl grid-cols-12 gap-3",
				loading && "opacity-40 transition-opacity"
			)}
		>
			<div className={"col-span-12 sm:col-span-10 sm:col-start-2"}>{children}</div>
		</div>
	);
};

export default PageContainer;
