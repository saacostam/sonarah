import { screen, waitFor } from "@testing-library/dom";
import { RouteName } from "@/features/navigation/domain";
import { NavigationAdapter } from "@/features/navigation/infra";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { renderWithProviders } from "@/shared/tests";
import type { ISession } from "./domain";
import { AuthGuard } from "./ui";

const navigationAdapter = new NavigationAdapter();

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
			getPathname: () => pathname,
			push,
		},
		authAdapter: {
			getToken: async () => {
				if (authError) throw authError;
				return authState;
			},
		},
		navigationAdapter,
	};

	return { push, adapters };
}

describe("AuthGuard [Integration]", () => {
	it("should render children if accessing a public route and unauthenticated", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
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
			pathname: navigationAdapter.generateRoute({
				name: RouteName.DASHBOARD,
			}),
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
			pathname: navigationAdapter.generateRoute({
				name: RouteName.DASHBOARD,
			}),
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
			expect(push).toHaveBeenCalledWith(
				navigationAdapter.generateRoute({
					name: RouteName.HOME,
				}),
			);
		});
	});

	it("should redirect to dashboard if authenticated and accessing auth route", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
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
			expect(push).toHaveBeenCalledWith(
				navigationAdapter.generateRoute({
					name: RouteName.DASHBOARD,
				}),
			);
		});
	});

	it("should render skeleton in case of session error", async () => {
		const { push, adapters } = setupAuthGuard({
			pathname: navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
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
