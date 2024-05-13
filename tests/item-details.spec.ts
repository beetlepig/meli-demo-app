import { expect, test } from "@playwright/test";

test.describe("Item Details", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("./items?search=PS5");
		await expect(page).toHaveTitle("PS5 | Mercado Libre");

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

	test("Content check", async ({ page, isMobile }) => {
		const mainImage = page.getByTestId("item-main-image");
		await expect(mainImage).toBeVisible();

		const itemTitle = page.getByTestId(isMobile ? "item-title-mobile" : "item-title");
		await expect(itemTitle).toBeVisible();
		await expect(itemTitle).toHaveText(/\S/);

		const itemDescription = page.getByTestId("item-description");
		await expect(itemDescription).toBeVisible();
		await expect(itemDescription).toHaveText(/\S/);

		await page.pause();
	});
});
