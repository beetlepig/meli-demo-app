import type { FunctionComponent } from "react";

interface LogoProps {
	size: number;
}

const Logo: FunctionComponent<LogoProps> = ({ size }) => {
	return <img width={size} alt={"ML Logo"} src={"/images/logo_ml.png"} />;
};

export default Logo;
