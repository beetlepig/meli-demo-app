import { expect, test } from "@playwright/test";

test.describe("Search Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("./items?search=PS5");
		await expect(page).toHaveTitle("PS5 | Mercado Libre");
	});

	test("Navigate Home", async ({ page }) => {
		const mlLogo = page.getByRole("link", { name: "ML Logo" });
		await expect(mlLogo).toBeVisible();
		await mlLogo.click();

		await page.waitForURL("/");
	});

	test("Search query persistence", async ({ page }) => {
		const searchBar = page.getByPlaceholder("Nunca dejes de buscar");
		await expect(searchBar).toBeVisible();
		await expect(searchBar).toHaveValue("PS5");
	});

	test("Search Items - MAX 4", async ({ page }) => {
		const items = page.getByTestId("item-element");
		await expect(items).toHaveCount(4);
	});

	test("Go to details", async ({ page }) => {
		const items = page.getByTestId("item-element");
		await expect(items).toHaveCount(4);

		const fistItem = items.first();
		await expect(fistItem).toBeVisible();
		const itemLink = fistItem.getByRole("link").first();
		const itemImage = itemLink.getByRole("img");
		await expect(itemImage).toBeVisible();
		await itemLink.click();

		await page.waitForURL("**/items/*");
	});
});
