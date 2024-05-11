import { clsx } from "clsx/lite";
import type { FunctionComponent, SVGProps } from "react";

const SpinnerIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
			className={clsx("animate-spin", props.className)}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9"
			/>
		</svg>
	);
};

export default SpinnerIcon;
