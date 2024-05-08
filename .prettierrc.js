/** @type {import("prettier").Options} */
export default {
    useTabs: true,
    singleQuote: false,
    trailingComma: "none",
    printWidth: 100,
    endOfLine: "lf",
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    overrides: [
        {
            files: ["*.ts?(x), *.js?(x)"],
            options: {
                bracketSameLine: false
            }
        },
        {
            files: ["README.md", "package.json"],
            options: {
                useTabs: false,
                tabWidth: 2
            }
        }
    ]
};
