import { type FunctionComponent, memo } from "react";
import BreadcrumbIcon from "~/components/atoms/icons/breadcrumb";

interface BreadcrumbListProps {
	categoryList: string[];
}

const BreadcrumbList: FunctionComponent<BreadcrumbListProps> = ({ categoryList }) => {
	return (
		<ol className={"mb-4 ml-4 mt-3 sm:ml-0"}>
			{categoryList.map((category, index) => (
				<li key={category} className={"inline text-sm font-light text-gray-700"}>
					<p className={index === categoryList.length - 1 ? "inline font-medium" : "inline"}>
						{category}
					</p>
					{index < categoryList.length - 1 && (
						<BreadcrumbIcon className={"mx-1 inline h-3 w-3"} stroke={"currentColor"} />
					)}
				</li>
			))}
		</ol>
	);
};

export default memo(BreadcrumbList);
