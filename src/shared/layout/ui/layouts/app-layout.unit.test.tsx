import { renderWithProviders } from "@/tests";
import { AppLayout } from "./app-layout";

describe("AppLayout [Unit]", () => {
	it("should include the css classes necessary to render the background correctly", () => {
		/**
		 * The intent of this test is to act as a guard for the CSS class implementation.
		 * It does test an implementation detail, which isn’t ideal, but it provides useful
		 * friction to ensure changes are intentional. If the implementation changes, it’s
		 * okay to update or remove this test accordingly, if behavior is validated.
		 */
		const { container } = renderWithProviders(<AppLayout />, {
			adapters: {
				authAdapter: {
					getToken: () => ({
						type: "authenticated",
						token: "code",
					}),
				},
				navigationAdapter: {
					generateRoute: vi.fn(),
				},
				themeAdapter: {},
			},
		});

		const elWithAppShellClass = container.querySelector(".app-shell");
		expect(elWithAppShellClass).toBeDefined();
		const elWithAppShellBgClass =
			elWithAppShellClass?.querySelector("app-shell__bg");
		expect(elWithAppShellBgClass);
	});
});
