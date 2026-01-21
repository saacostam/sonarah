import { screen, waitFor } from "@testing-library/dom";
import type { ISession } from "@/shared/adapters/auth/domain";
import type { DomainError } from "@/shared/adapters/errors/domain";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
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
			getToken: () => {
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

		const content = screen.getByTestId("content");
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

		const content = screen.getByTestId("content");
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

		expect(screen.getByTestId("lazy-loaded-skeleton")).toBeInTheDocument();
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

		expect(screen.getByTestId("lazy-loaded-skeleton")).toBeInTheDocument();
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith(
				navigationAdapter.generateRoute({
					name: RouteName.DASHBOARD,
				}),
			);
		});
	});
});
