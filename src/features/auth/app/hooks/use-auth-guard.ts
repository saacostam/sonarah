import { useEffect, useMemo } from "react";
import { useAdapters } from "@/shared/adapters/core/app";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { PUBLIC_ROUTES } from "../../domain";

export function useAuthGuard() {
	const { authAdapter, routerAdapter, navigationAdapter } = useAdapters();
	const session = authAdapter.getToken();

	const publicRoutesPaths = useMemo(
		() =>
			PUBLIC_ROUTES.map((route) =>
				navigationAdapter.generateRoute({ name: route }),
			),
		[navigationAdapter],
	);

	const location = routerAdapter.getPathname();
	const isPublicRoute = publicRoutesPaths.some(
		(publicRoute) => location === publicRoute,
	);

	const shouldGoToApp = session.type === "authenticated" && isPublicRoute;
	const shouldGoToHome = session.type === "unauthenticated" && !isPublicRoute;

	useEffect(() => {
		if (shouldGoToApp) {
			routerAdapter.push(
				navigationAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		}
	}, [routerAdapter, navigationAdapter, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoToHome) {
			routerAdapter.push(
				navigationAdapter.generateRoute({ name: RouteName.HOME }),
			);
		}
	}, [routerAdapter, navigationAdapter, shouldGoToHome]);

	const pending = shouldGoToApp || shouldGoToHome;

	return useMemo(() => (pending ? "loading" : "success"), [pending]);
}
