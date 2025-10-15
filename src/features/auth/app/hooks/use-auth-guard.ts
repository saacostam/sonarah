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

	const shouldGoToApp =
		session.isSuccess && session.data.type === "authenticated" && isPublicRoute;
	const shouldGoLogin =
		session.isSuccess &&
		session.data.type === "unauthenticated" &&
		!isPublicRoute;

	useEffect(() => {
		if (shouldGoToApp) {
			routerAdapter.push(
				routerAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		}
	}, [routerAdapter, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoLogin) {
			routerAdapter.push(
				routerAdapter.generateRoute({ name: RouteName.LOGIN }),
			);
		}
	}, [routerAdapter, shouldGoLogin]);

	const pending = !session.isSuccess || shouldGoToApp || shouldGoLogin;

	return useMemo(
		() => (session.isError ? "error" : pending ? "loading" : "success"),
		[pending, session.isError],
	);
}
