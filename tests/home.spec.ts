import { expect, test } from "@playwright/test";

test.describe("Main Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("./");
		await expect(page).toHaveTitle("Mercado Libre");
	});

	test("Header", async ({ page }) => {
		const mlLogo = page.getByRole("link", { name: "ML Logo" });
		await expect(mlLogo).toBeVisible();

		const searchBar = page.getByPlaceholder("Nunca dejes de buscar");
		await expect(searchBar).toBeVisible();

		const searchButton = page.getByRole("button", { name: "Search" });
		await expect(searchButton).toBeVisible();
	});

	test("Use Search Bar", async ({ page }) => {
		const searchBar = page.getByPlaceholder("Nunca dejes de buscar");
		await searchBar.fill("PS5");

		const searchButton = page.getByRole("button", { name: "Search" });
		await searchButton.click();

		await page.waitForURL("**/items?search=PS5");
	});
});
