import { screen, waitFor } from "@testing-library/dom";
import { DomainError, DomainErrorType } from "@/features/errors/domain";
import { type GenerateRouteAction, RouteName } from "@/features/router/domain";
import { renderWithProviders } from "@/shared/tests";
import type { ISession } from "./domain";
import { AuthGuard } from "./ui";

const generateRoute = (action: GenerateRouteAction) => {
	switch (action.name) {
		case RouteName.DASHBOARD:
			return "/dashboard";
		case RouteName.HOME:
			return "/home";
		default:
			return "/other";
	}
};

function setupAuthGuard({
	pathname = "/home",
	authState = { type: "unauthenticated" },
	authError,
}: {
	pathname?: string;
	authState?: ISession;
	authError?: DomainError;
}) {
	const push = vi.fn();

	const adapters = {
		routerAdapter: {
			generateRoute,
			getPathname: () => pathname,
			push,
		},
		authAdapter: {
			getToken: async () => {
				if (authError) throw authError;
				return authState;
			},
		},
	};

	return { push, adapters };
}

describe("AuthGuard [Integration]", () => {
	it("should render children if accessing a public route and unauthenticated", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: "/home",
			authState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();

		const content = await screen.findByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should render children if accessing a private route and authenticated", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: "/dashboard",
			authState: { type: "authenticated", token: "token" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();

		const content = await screen.findByTestId("content");
		expect(content).toBeInTheDocument();
		expect(push).not.toHaveBeenCalled();
	});

	it("should redirect to home if unauthenticated on private route", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: "/requires-auth",
			authState: { type: "unauthenticated" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith("/home");
		});
	});

	it("should redirect to dashboard if authenticated and accessing auth route", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: "/home",
			authState: { type: "authenticated", token: "token" },
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith("/dashboard");
		});
	});

	it("should render skeleton in case of session error", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: "/home",
			authError: new DomainError(DomainErrorType.BAD_REQUEST, "Bad Request"),
		});

		renderWithProviders(
			<AuthGuard>
				<div data-testid="content" />
			</AuthGuard>,
			{ adapters },
		);

		expect(screen.getByTestId("auth-guard-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).not.toHaveBeenCalled();
		});
	});
});
