import { useEffect, useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouteName } from "@/features/navigation/domain";
import { useQuerySession } from "../../app";
import { PUBLIC_ROUTES } from "../../domain";

export function useAuthGuard() {
	const { routerAdapter, navigationAdapter } = useAdapters();
	const session = useQuerySession();

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

	const shouldGoToApp =
		session.isSuccess && session.data.type === "authenticated" && isPublicRoute;
	const shouldGoToHome =
		session.isSuccess &&
		session.data.type === "unauthenticated" &&
		!isPublicRoute;

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

	const pending = !session.isSuccess || shouldGoToApp || shouldGoToHome;

	return useMemo(
		() => (session.isError ? "error" : pending ? "loading" : "success"),
		[pending, session.isError],
	);
}
