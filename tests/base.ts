import { test as base, expect } from "@playwright/test";
import { BasePage } from "./pages/classes";

export const test = base.extend<{ exceptionLogger: void }>({
	page: async ({ page }, use) => {
		const basePage = new BasePage(page);

		await basePage.goTo("");


		await use(page);
	},
	exceptionLogger: [
    	async ({ page }, use) => {
			const errors: Error[] = [];
			page.on("pageerror", (error) => errors.push(error));

    		await use();

			if (errors.length > 0) {
				await test.info().attach("frontend-exceptions", {
					body: errors.map((error) => error.stack).join("\n-----\n"),
				})
					
				throw new Error()
			}		
    	},
    	{ auto: true },
	],
});
