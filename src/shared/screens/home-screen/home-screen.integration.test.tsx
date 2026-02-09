import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import type { IAuthRepositoryPayload } from "@/features/auth/domain";
import type { IAuthAdapterPayload } from "@/shared/adapters/auth/domain";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import { HomeScreen } from "./home-screen";

const navigationAdapter = new NavigationAdapter();

const diFactory = (args: { token: "auth" | "unauth"; code?: string }) => {
	// adapters
	const analyticsTrackEvent = vi.fn();
	const setToken = vi.fn();
	const startAuthFlow = vi.fn();
	const resetRouter = vi.fn();

	// repositories
	const requestAccessToken = vi.fn();

	const di: Parameters<typeof renderWithProviders>[1] = {
		adapters: {
			authAdapter: {
				getToken: () =>
					args.token === "auth"
						? { type: "authenticated", token: "token" }
						: { type: "unauthenticated" },
				setToken,
				startAuthFlow,
			},
			routerAdapter: {
				getUrlSearchParams: () =>
					new URLSearchParams({ code: args.code ?? "" }),
				reset: resetRouter,
			},
			navigationAdapter,
			analyticsAdapter: {
				trackEvent: analyticsTrackEvent,
			},
		},
		repositories: {
			auth: {
				requestAccessToken,
			},
		},
	};

	return {
		di,
		deps: {
			analyticsTrackEvent,
			requestAccessToken,
			setToken,
			startAuthFlow,
			resetRouter,
		},
	};
};

describe("HomeScreen [Integration]", () => {
	it("should handle loading state because code is available", async () => {
		const { di } = diFactory({
			token: "unauth",
			code: "code",
		});

		renderWithProviders(<HomeScreen />, di);

		expect(screen.getByTestId("lazy-loaded-skeleton")).toBeDefined();

		await waitFor(() => {
			expect(screen.queryByTestId("home-screen-content")).toBeNull();
		});
	});

	it("should request access-token if code is available and reset route", async () => {
		const { di, deps } = diFactory({
			token: "unauth",
			code: "code",
		});

		deps.requestAccessToken.mockResolvedValueOnce("code");

		renderWithProviders(<HomeScreen />, di);

		await waitFor(() => {
			const payload: IAuthRepositoryPayload["IRequestAccessTokenIn"] = {
				code: "code",
			};
			expect(deps.requestAccessToken).toHaveBeenCalledWith(payload);
		});

		await waitFor(() => {
			const payload: IAuthAdapterPayload["ISetTokenIn"] = {
				token: "code",
			};
			expect(deps.setToken).toHaveBeenCalledWith(payload);
			expect(deps.resetRouter).toHaveBeenCalled();
		});
	});

	it("should render login button if unauthenticated", async () => {
		const { di, deps } = diFactory({ token: "unauth" });

		renderWithProviders(<HomeScreen />, di);

		await waitFor(() => {
			expect(screen.getByTestId("home-screen-content")).toBeInTheDocument();
		});

		const button = await screen.findByRole("button", { name: /login/i });
		await userEvent.click(button);

		expect(deps.startAuthFlow).toHaveBeenCalledTimes(1);
	});

	it("should render start-now button if authenticated", async () => {
		const { di } = diFactory({ token: "auth" });

		renderWithProviders(<HomeScreen />, di);

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
