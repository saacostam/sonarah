import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type { IAuthRepositoryPayload } from "@/features/auth/domain";
import type { IAuthAdapterPayload } from "@/shared/adapters/auth/domain";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import { HomeScreen } from "./home-screen";

const navigationAdapter = new NavigationAdapter();

const diFactory = (args: {
	token: "auth" | "unauth";
	code?: string;
}): Parameters<typeof renderWithProviders>["1"] => {
	return {
		adapters: {
			authAdapter: {
				getToken: () =>
					args.token === "auth"
						? {
								type: "authenticated",
								token: "token",
							}
						: {
								type: "unauthenticated",
							},
			},
			routerAdapter: {
				getUrlSearchParams: () =>
					new URLSearchParams({ code: args.code ?? "" }),
			},
			navigationAdapter,
		},
		repositories: {
			auth: {},
		},
	};
};

describe("HomeScreen [Integration]", () => {
	it("should handle loading state because code is available", async () => {
		renderWithProviders(
			<HomeScreen />,
			diFactory({
				token: "unauth",
				code: "code",
			}),
		);

		expect(screen.getByTestId("lazy-loaded-skeleton")).toBeDefined();
		await waitFor(() => {
			expect(screen.queryByTestId("home-screen-content")).toBeNull();
		});
	});

	it("should request access-token if code is available and reset route", async () => {
		const requestAccessToken = vi.fn();
		const resetRouter = vi.fn();
		const setToken = vi.fn();

		const di = diFactory({
			token: "unauth",
			code: "code",
		});

		requestAccessToken.mockResolvedValueOnce("code");
		renderWithProviders(<HomeScreen />, {
			...di,
			repositories: {
				...di?.repositories,
				auth: {
					...di?.repositories?.auth,
					requestAccessToken,
				},
			},
			adapters: {
				...di?.adapters,
				authAdapter: {
					...di?.adapters?.authAdapter,
					setToken,
				},
				routerAdapter: {
					...di?.adapters?.routerAdapter,
					reset: resetRouter,
				},
			},
		});

		await waitFor(() => {
			const payload: IAuthRepositoryPayload["IRequestAccessTokenIn"] = {
				code: "code",
			};
			expect(requestAccessToken).toHaveBeenCalledWith(payload);
		});

		await waitFor(() => {
			const payload: IAuthAdapterPayload["ISetTokenIn"] = {
				token: "code",
			};
			expect(setToken).toHaveBeenCalledWith(payload);
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
