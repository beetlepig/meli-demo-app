import type { FunctionComponent } from "react";

interface LogoProps {
	size: number;
}

const Logo: FunctionComponent<LogoProps> = ({ size }) => {
	return (
		<img
			width={size}
			alt={"ML Logo"}
			src={"/images/logo_ml.png"}
			srcSet="/images/logo_ml.png 1x,
  			/images/logo_ml@2x.png 2x"
		/>
	);
};

export default Logo;
