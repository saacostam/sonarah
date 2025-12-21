import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import { Navbar } from "./ui";

const navigationAdapter = new NavigationAdapter();

// Helper to create auth mock with shared shape
const makeAuthAdapter = (state: "authenticated" | "unauthenticated") => {
	const startAuthFlow = vi.fn();
	const removeToken = vi.fn();

	return {
		getToken: async () =>
			state === "authenticated"
				? { type: "authenticated" as const, token: "hello" }
				: { type: "unauthenticated" as const },
		startAuthFlow,
		removeToken,
	};
};

describe("Navbar [Integration]", () => {
	it("should render login and trigger auth flow if session is unauthenticated", async () => {
		const authAdapter = makeAuthAdapter("unauthenticated");

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter,
				navigationAdapter,
			},
		});

		const cta = await screen.findByRole("button", { name: /login/i });
		await userEvent.click(cta);

		expect(authAdapter.startAuthFlow).toHaveBeenCalled();
		expect(authAdapter.removeToken).not.toHaveBeenCalled();
	});

	it("should render logout and remove token if session is authenticated", async () => {
		const authAdapter = makeAuthAdapter("authenticated");

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter,
				navigationAdapter,
			},
		});

		const cta = await screen.findByRole("button", { name: /sign out/i });
		await userEvent.click(cta);

		expect(authAdapter.removeToken).toHaveBeenCalled();
		expect(authAdapter.startAuthFlow).not.toHaveBeenCalled();
	});

	it("should link logo to home if user is unauthenticated", async () => {
		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("unauthenticated"),
				navigationAdapter,
			},
		});

		const logo: HTMLAnchorElement = await screen.findByRole("link");
		await waitFor(() => {
			expect(new URL(logo.href).pathname).toBe(
				navigationAdapter.generateRoute({ name: RouteName.HOME }),
			);
		});
	});

	it("should link logo to dashboard if user is authenticated", async () => {
		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("authenticated"),
				navigationAdapter,
			},
		});

		const logo: HTMLAnchorElement = await screen.findByRole("link");
		await waitFor(() => {
			expect(new URL(logo.href).pathname).toBe(
				navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		});
	});
});
