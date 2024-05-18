const getSiteName = (countryCode?: string) => {
	switch (countryCode) {
		case "CO": {
			return "MCO";
		}
		case "MX": {
			return "MLM";
		}
		case "CL": {
			return "MLC";
		}
		case "AR": {
			return "MLA";
		}
		case "PE": {
			return "MPE";
		}
		default: {
			return "MLA";
		}
	}
};

export { getSiteName };
