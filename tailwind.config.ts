import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Roboto Flex Variable"', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				yellow: { 500: "#FFE600" },
				gray: {
					100: "#EEEEEE",
					700: "#999999",
					800: "#666666",
					900: "#333333"
				},
				blue: { 500: "#3483FA" }
			}
		}
	},
	plugins: []
} satisfies Config;
