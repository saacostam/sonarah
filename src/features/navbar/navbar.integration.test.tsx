import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { LimitedUsersAccessAlertManagerContext } from "@/features/access/limited-users/app";
import type { ILimitedUsersAccessAlertManager } from "@/features/access/limited-users/domain";
import type { IAnalyticsEvent } from "@/shared/adapters/analytics/domain";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { IThemeVariant } from "@/shared/adapters/theme/domain";
import { renderWithProviders } from "@/tests";
import { Navbar } from "./ui";

const navigationAdapter = new NavigationAdapter();

// Helper to create auth mock with shared shape
const makeAuthAdapter = (state: "authenticated" | "unauthenticated") => {
	const startAuthFlow = vi.fn();
	const removeToken = vi.fn();

	return {
		getToken: () =>
			state === "authenticated"
				? { type: "authenticated" as const, token: "hello" }
				: { type: "unauthenticated" as const },
		startAuthFlow,
		removeToken,
	};
};

const makeThemeAdapter = (initTheme?: IThemeVariant) => {
	const setTheme = vi.fn();

	return {
		setTheme,
		theme: initTheme ?? IThemeVariant.LIGHT,
	};
};

const makeAnalyticsAdapter = () => {
	return {
		trackEvent: vi.fn(),
	};
};

const makeLimitedUsersAccessAlertManager = () => {
	const setManagerStatus = vi.fn();
	const limitedUsersAccessAlertManager: ILimitedUsersAccessAlertManager = {
		status: {
			type: "closed",
		},
		setStatus: setManagerStatus,
	};

	return {
		limitedUsersAccessAlertManager,
		setManagerStatus,
	};
};

describe("Navbar [Integration]", () => {
	describe("Login", () => {
		it("should render login and trigger auth flow when clicked, if session is unauthenticated and no limited-users-access-alert-manager is available", async () => {
			const analyticsAdapter = makeAnalyticsAdapter();
			const authAdapter = makeAuthAdapter("unauthenticated");
			const themeAdapter = makeThemeAdapter();

			renderWithProviders(<Navbar />, {
				adapters: {
					analyticsAdapter,
					authAdapter,
					navigationAdapter,
					themeAdapter,
				},
			});

			const cta = await screen.findByRole("button", { name: /login/i });
			await userEvent.click(cta);

			expect(authAdapter.startAuthFlow).toHaveBeenCalled();
			expect(authAdapter.removeToken).not.toHaveBeenCalled();

			const clickLoginButtonEvent: IAnalyticsEvent = {
				name: "click-login-button",
				payload: {
					location: "navbar",
				},
			};
			expect(analyticsAdapter.trackEvent).toHaveBeenCalledExactlyOnceWith(
				clickLoginButtonEvent,
			);
		});

		it("should render login and trigger alert, if session is unauthenticated and limited-users-access-alert-manager is available", async () => {
			const analyticsAdapter = makeAnalyticsAdapter();
			const authAdapter = makeAuthAdapter("unauthenticated");
			const themeAdapter = makeThemeAdapter();

			const { limitedUsersAccessAlertManager, setManagerStatus } =
				makeLimitedUsersAccessAlertManager();

			renderWithProviders(
				<LimitedUsersAccessAlertManagerContext.Provider
					value={limitedUsersAccessAlertManager}
				>
					<Navbar />
				</LimitedUsersAccessAlertManagerContext.Provider>,
				{
					adapters: {
						analyticsAdapter,
						authAdapter,
						navigationAdapter,
						themeAdapter,
					},
				},
			);

			const cta = await screen.findByRole("button", { name: /login/i });
			await userEvent.click(cta);

			// Check that alert was triggered
			expect(setManagerStatus).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({
					type: "open",
				}),
			);
			expect(authAdapter.startAuthFlow).not.toHaveBeenCalled();
			expect(analyticsAdapter.trackEvent).not.toHaveBeenCalled();

			expect(authAdapter.removeToken).not.toHaveBeenCalled();

			// Check if onContinue callback triggers login
			setManagerStatus.mock.calls[0][0].onContinue();

			await waitFor(() => {
				expect(authAdapter.startAuthFlow).toHaveBeenCalled();
				expect(authAdapter.removeToken).not.toHaveBeenCalled();

				const clickLoginButtonEvent: IAnalyticsEvent = {
					name: "click-login-button",
					payload: {
						location: "navbar",
					},
				};
				expect(analyticsAdapter.trackEvent).toHaveBeenCalledExactlyOnceWith(
					clickLoginButtonEvent,
				);
			});
		});
	});

	it("should render logout and remove token when clicked, if session is authenticated", async () => {
		const authAdapter = makeAuthAdapter("authenticated");
		const themeAdapter = makeThemeAdapter();
		const routerAdapterPush = vi.fn();

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter,
				navigationAdapter,
				themeAdapter,
				routerAdapter: {
					push: routerAdapterPush,
				},
			},
		});

		const cta = await screen.findByRole("button", { name: /sign out/i });
		await userEvent.click(cta);

		expect(authAdapter.removeToken).toHaveBeenCalled();
		expect(authAdapter.startAuthFlow).not.toHaveBeenCalled();

		// redirect to home
		expect(routerAdapterPush).toHaveBeenCalledWith(
			navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
		);
	});

	it("should link logo to home if user is unauthenticated", async () => {
		const themeAdapter = makeThemeAdapter();

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("unauthenticated"),
				navigationAdapter,
				themeAdapter,
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
		const themeAdapter = makeThemeAdapter();

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("authenticated"),
				navigationAdapter,
				themeAdapter,
			},
		});

		const logo: HTMLAnchorElement = await screen.findByRole("link");
		await waitFor(() => {
			expect(new URL(logo.href).pathname).toBe(
				navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		});
	});

	it("should toggle appearance from light to dark", async () => {
		const themeAdapter = makeThemeAdapter(IThemeVariant.LIGHT);

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("authenticated"),
				navigationAdapter,
				themeAdapter,
			},
		});

		const toggleThemeButton = await screen.findByRole("button", {
			name: "Toggle Appearance",
		});
		userEvent.click(toggleThemeButton);

		await waitFor(() => {
			expect(themeAdapter.setTheme).toHaveBeenCalledExactlyOnceWith(
				IThemeVariant.DARK,
			);
		});
	});

	it("should toggle appearance from dark to ligth", async () => {
		const themeAdapter = makeThemeAdapter(IThemeVariant.DARK);

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: makeAuthAdapter("authenticated"),
				navigationAdapter,
				themeAdapter,
			},
		});

		const toggleThemeButton = await screen.findByRole("button", {
			name: "Toggle Appearance",
		});
		userEvent.click(toggleThemeButton);

		await waitFor(() => {
			expect(themeAdapter.setTheme).toHaveBeenCalledExactlyOnceWith(
				IThemeVariant.LIGHT,
			);
		});
	});
});
