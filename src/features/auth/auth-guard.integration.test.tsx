import { screen, waitFor } from "@testing-library/dom";
import { RouteName } from "@/features/router/domain";
import { renderWithProviders } from "@/shared/tests";
import { DomainError, DomainErrorType } from "../errors/domain";
import { AuthGuard } from "./ui";

describe("AuthGuard [Integration]", () => {
	it("should render children if accessing a public route and unauthenticated", async () => {
		const push = vi.fn();

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{
				adapters: {
					routerAdapter: {
						generateRoute: (action) => {
							switch (action.name) {
								case RouteName.DASHBOARD:
									return "/dashboard";
								case RouteName.HOME:
									return "/home";
								default:
									return "/other";
							}
						},
						getPathname: () => "/home",
						push,
					},
					authAdapter: {
						getToken: async () => ({ type: "unauthenticated" }),
					},
				},
			},
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();

		const content = await screen.findByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should render children if accessing a private route and authenticated", async () => {
		const push = vi.fn();

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{
				adapters: {
					routerAdapter: {
						generateRoute: (action) => {
							switch (action.name) {
								case RouteName.DASHBOARD:
									return "/dashboard";
								case RouteName.HOME:
									return "/home";
								default:
									return "/other";
							}
						},
						getPathname: () => "/dashboard",
						push,
					},
					authAdapter: {
						getToken: async () => ({
							type: "authenticated",
							token: "token",
						}),
					},
				},
			},
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();

		const content = await screen.findByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should redirect to home if unauthenticated on private route", async () => {
		const push = vi.fn();

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{
				adapters: {
					routerAdapter: {
						generateRoute: (action) => {
							switch (action.name) {
								case RouteName.DASHBOARD:
									return "/dashboard";
								case RouteName.HOME:
									return "/home";
								default:
									return "/other";
							}
						},
						getPathname: () => "/requires-auth",
						push,
					},
					authAdapter: {
						getToken: async () => ({ type: "unauthenticated" }),
					},
				},
			},
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith("/home");
		});
	});

	it("should redirect to dashboard if authenticated and accessing auth route", async () => {
		const push = vi.fn();

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{
				adapters: {
					routerAdapter: {
						generateRoute: (action) => {
							switch (action.name) {
								case RouteName.DASHBOARD:
									return "/dashboard";
								case RouteName.HOME:
									return "/home";
								default:
									return "/other";
							}
						},
						getPathname: () => "/home",
						push,
					},
					authAdapter: {
						getToken: async () => ({
							type: "authenticated",
							token: "token",
						}),
					},
				},
			},
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith("/dashboard");
		});
	});

	it("should render skeleton in case of session error", async () => {
		const push = vi.fn();

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{
				adapters: {
					routerAdapter: {
						generateRoute: (action) => {
							switch (action.name) {
								case RouteName.DASHBOARD:
									return "/dashboard";
								case RouteName.HOME:
									return "/home";
								default:
									return "/other";
							}
						},
						getPathname: () => "/home",
						push,
					},
					authAdapter: {
						getToken: async () => {
							throw new DomainError(DomainErrorType.BAD_REQUEST, "Bad Request");
						},
					},
				},
			},
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).not.toHaveBeenCalled();
		});
	});
});
