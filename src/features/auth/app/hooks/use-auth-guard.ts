import { useEffect, useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouteName } from "@/features/routes/domain";
import { useQuerySession } from "../../app";
import { PUBLIC_ROUTES } from "../../domain";

export function useAuthGuard() {
	const { routerAdapter, routesAdapter } = useAdapters();
	const session = useQuerySession();

	const publicRoutesPaths = useMemo(
		() =>
			PUBLIC_ROUTES.map((route) =>
				routesAdapter.generateRoute({ name: route }),
			),
		[routesAdapter],
	);

	const location = routerAdapter.getPathname();
	const isPublicRoute = publicRoutesPaths.some(
		(publicRoute) => location === publicRoute,
	);

	const shouldGoToApp =
		session.isSuccess && session.data.type === "authenticated" && isPublicRoute;
	const shouldGoToHome =
		session.isSuccess &&
		session.data.type === "unauthenticated" &&
		!isPublicRoute;

	useEffect(() => {
		if (shouldGoToApp) {
			routerAdapter.push(
				routesAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		}
	}, [routerAdapter, routesAdapter, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoToHome) {
			routerAdapter.push(routesAdapter.generateRoute({ name: RouteName.HOME }));
		}
	}, [routerAdapter, routesAdapter, shouldGoToHome]);

	const pending = !session.isSuccess || shouldGoToApp || shouldGoToHome;

	return useMemo(
		() => (session.isError ? "error" : pending ? "loading" : "success"),
		[pending, session.isError],
	);
}
