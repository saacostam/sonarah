import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type {
	IAuthAdapterPayload,
	ISession,
} from "@/shared/adapters/auth/domain";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import { HomeScreen } from "./ui";

const navigationAdapter = new NavigationAdapter();

const diFactory = (args: {
	token: "auth" | "unauth" | "pending";
	code?: string;
}): Parameters<typeof renderWithProviders>["1"] => {
	return {
		adapters: {
			authAdapter: {
				getToken: async () => {
					if (args.token === "auth") {
						return {
							type: "authenticated",
							token: "token",
						};
					} else if (args.token === "unauth") {
						return {
							type: "unauthenticated",
						};
					} else {
						return new Promise<ISession>(() => {});
					}
				},
			},
			routerAdapter: {
				getUrlSearchParams: () =>
					new URLSearchParams({ code: args.code ?? "" }),
			},
			navigationAdapter,
		},
	};
};

describe("HomeScreen [Integration]", () => {
	it("should handle loading state because of pending query", async () => {
		renderWithProviders(
			<HomeScreen />,
			diFactory({
				token: "pending",
			}),
		);

		expect(screen.getByTestId("home-screen-skeleton")).toBeDefined();
		await waitFor(() => {
			expect(screen.queryByTestId("home-screen-content")).toBeNull();
		});
	});

	it("should handle loading state because code is available", async () => {
		renderWithProviders(
			<HomeScreen />,
			diFactory({
				token: "unauth",
				code: "code",
			}),
		);

		expect(screen.getByTestId("home-screen-skeleton")).toBeDefined();
		await waitFor(() => {
			expect(screen.queryByTestId("home-screen-content")).toBeNull();
		});
	});

	it("should request access-token if code is available and reset route", async () => {
		const requestAccessToken = vi.fn();
		const resetRouter = vi.fn();

		const di = diFactory({
			token: "unauth",
			code: "code",
		});

		renderWithProviders(<HomeScreen />, {
			...di,
			adapters: {
				...di?.adapters,
				authAdapter: {
					...di?.adapters?.authAdapter,
					requestAccessToken,
				},
				routerAdapter: {
					...di?.adapters?.routerAdapter,
					reset: resetRouter,
				},
			},
		});

		await waitFor(() => {
			const payload: IAuthAdapterPayload["IRequestAccessTokenIn"] = {
				code: "code",
			};
			expect(requestAccessToken).toHaveBeenCalledWith(payload);
		});

		await waitFor(() => {
			expect(resetRouter).toHaveBeenCalled();
		});
	});

	it("should render login button if unauthenticated", async () => {
		const startAuthFlow = vi.fn();

		const di = diFactory({ token: "unauth" });

		renderWithProviders(<HomeScreen />, {
			...di,
			adapters: {
				...di?.adapters,
				authAdapter: {
					...di?.adapters?.authAdapter,
					startAuthFlow,
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("home-screen-content")).toBeInTheDocument();
		});

		const button = await screen.findByRole("button", { name: /login/i });
		await userEvent.click(button);

		await waitFor(() => {
			expect(startAuthFlow).toHaveBeenCalledTimes(1);
		});
	});

	it("should render start-now button if authenticated", async () => {
		const di = diFactory({ token: "auth" });

		renderWithProviders(<HomeScreen />, {
			...di,
			adapters: {
				...di?.adapters,
				routerAdapter: {
					...di?.adapters?.routerAdapter,
				},
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("home-screen-content")).toBeInTheDocument();
		});

		const button = await screen.findByRole<HTMLAnchorElement>("link", {
			name: /start now/i,
		});
		expect(new URL(button.href).pathname).toBe(
			navigationAdapter.generateRoute({
				name: RouteName.DASHBOARD,
			}),
		);
	});
});
