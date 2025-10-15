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
				routerAdapter.generateRoute({ name: RouteName.DASHBOARD }),
			);
		}
	}, [routerAdapter, shouldGoToApp]);

	useEffect(() => {
		if (shouldGoToHome) {
			routerAdapter.push(routerAdapter.generateRoute({ name: RouteName.HOME }));
		}
	}, [routerAdapter, shouldGoToHome]);

	const pending = !session.isSuccess || shouldGoToApp || shouldGoToHome;

	return useMemo(
		() => (session.isError ? "error" : pending ? "loading" : "success"),
		[pending, session.isError],
	);
}
