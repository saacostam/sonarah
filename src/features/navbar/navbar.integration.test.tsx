import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { renderWithProviders } from "@/shared/tests";
import { RouteName } from "../router/domain";
import { Navbar } from "./ui";

describe("Navbar [Integration]", () => {
	it("should render login if session is unauthenticated", async () => {
		const startAuthFlowMock = vi.fn();
		const removeTokenMock = vi.fn();

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: {
					getToken: async () => ({ type: "unauthenticated" }),
					startAuthFlow: startAuthFlowMock,
					removeToken: removeTokenMock,
				},
				routerAdapter: {
					generateRoute: () => "/route",
				},
			},
		});

		let cta: HTMLElement;
		await waitFor(() => {
			cta = screen.getByRole("button");
		});
		act(() => {
			fireEvent.click(cta);
		});

		await waitFor(() => {
			expect(startAuthFlowMock).toHaveBeenCalled();
			expect(removeTokenMock).not.toHaveBeenCalled();
		});
	});

	it("should render logout if session is authenticated", async () => {
		const startAuthFlowMock = vi.fn();
		const removeTokenMock = vi.fn();

		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: {
					getToken: async () => ({ type: "authenticated", token: "hello" }),
					startAuthFlow: startAuthFlowMock,
					removeToken: removeTokenMock,
				},
				routerAdapter: {
					generateRoute: () => "/route",
				},
			},
		});

		let cta: HTMLElement;
		await waitFor(() => {
			cta = screen.getByRole("button");
		});
		act(() => {
			fireEvent.click(cta);
		});

		await waitFor(() => {
			expect(removeTokenMock).toHaveBeenCalled();
			expect(startAuthFlowMock).not.toHaveBeenCalled();
		});
	});

	it("should link logo to home if user is unauthenticated", async () => {
		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: {
					getToken: async () => ({ type: "unauthenticated" }),
				},
				routerAdapter: {
					generateRoute: (action) => {
						if (action.name === RouteName.DASHBOARD) return "/dashboard";
						if (action.name === RouteName.HOME) return "/home";
						return "/";
					},
				},
			},
		});

		let logo: HTMLAnchorElement;
		await waitFor(() => {
			logo = screen.getByRole("link");
			expect(logo.href).includes("/home");
		});
	});

	it("should link logo to dashboard if user is authenticated", async () => {
		renderWithProviders(<Navbar />, {
			adapters: {
				authAdapter: {
					getToken: async () => ({ type: "authenticated", token: "hello" }),
				},
				routerAdapter: {
					generateRoute: (action) => {
						if (action.name === RouteName.DASHBOARD) return "/dashboard";
						if (action.name === RouteName.HOME) return "/home";
						return "/";
					},
				},
			},
		});

		let logo: HTMLAnchorElement;
		await waitFor(() => {
			logo = screen.getByRole("link");
			expect(logo.href).includes("/dashboard");
		});
	});
});
