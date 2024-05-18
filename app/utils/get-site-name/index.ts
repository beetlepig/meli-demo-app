const getSiteLocaleInfo = (countryCode?: string) => {
	switch (countryCode) {
		case "CO": {
			return { siteName: "MCO", countryCode: countryCode, flag: "🇨🇴" };
		}
		case "MX": {
			return { siteName: "MLM", countryCode: countryCode, flag: "🇲🇽" };
		}
		case "CL": {
			return { siteName: "MLC", countryCode: countryCode, flag: "🇨🇱" };
		}
		case "AR": {
			return { siteName: "MLA", countryCode: countryCode, flag: "🇦🇷" };
		}
		case "PE": {
			return { siteName: "MPE", countryCode: countryCode, flag: "🇵🇪" };
		}
		default: {
			return { siteName: "MLA", countryCode: "AR", flag: "🇦🇷" };
		}
	}
};

export { getSiteLocaleInfo };
