import { useEffect, useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouteName } from "@/features/router/domain";
import { useQuerySession } from "../../app";
import { PUBLIC_ROUTES } from "../../domain";

export function useAuthGuard() {
	const { routerAdapter } = useAdapters();
	const session = useQuerySession();

	const publicRoutesPaths = useMemo(
		() =>
			PUBLIC_ROUTES.map((route) =>
				routerAdapter.generateRoute({ name: route }),
			),
		[routerAdapter],
	);

	const location = routerAdapter.getLocation();
	const isPublicRoute = publicRoutesPaths.some(
		(publicRoute) => location === publicRoute,
	);

	const shouldGoHome =
		session.isSuccess && session.data.type === "authenticated" && isPublicRoute;
	const shouldGoLogin =
		session.isSuccess &&
		session.data.type === "unauthenticated" &&
		!isPublicRoute;

	useEffect(() => {
		if (shouldGoHome) {
			routerAdapter.push(routerAdapter.generateRoute({ name: RouteName.HOME }));
		}
	}, [routerAdapter, shouldGoHome]);

	useEffect(() => {
		if (shouldGoLogin) {
			routerAdapter.push(
				routerAdapter.generateRoute({ name: RouteName.LOGIN }),
			);
		}
	}, [routerAdapter, shouldGoLogin]);

	const pending = !session.isSuccess || shouldGoHome || shouldGoLogin;

	return useMemo(
		() => (session.isError ? "error" : pending ? "loading" : "success"),
		[pending, session.isError],
	);
}
