import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import { useAdapters } from "@/features/adapters/app";
import { AppLayout } from "@/features/app-shell/ui";
import { AuthGuardSkeleton } from "@/features/auth/ui";
import { ErrorScreen } from "@/features/errors/ui";
import { HomeScreen } from "@/features/home/ui";
import { RouterContext } from "../../app";
import { RouteName } from "../../domain";

// Lazy imports
const ManagePlaylistScreen = lazy(() =>
	import("@/features/playlists/app/screens/manage-playlist-screen").then(
		(m) => ({ default: m.ManagePlaylistScreen }),
	),
);
const DashboardScreen = lazy(() =>
	import("@/features/dashboard/ui/screens/dashboard-screen").then((m) => ({
		default: m.DashboardScreen,
	})),
);

export function RouterProvider() {
	const { routerAdapter } = useAdapters();

	return (
		<RouterContext.Provider value={routerAdapter}>
			<Suspense fallback={<AuthGuardSkeleton />}>
				<Routes>
					<Route
						element={
							<AppLayout>
								<Outlet />
							</AppLayout>
						}
					>
						<Route index element={<HomeScreen />} />
						<Route
							path={routerAdapter.defineRoute(RouteName.DASHBOARD)}
							element={<DashboardScreen />}
						/>
						<Route
							path={routerAdapter.defineRoute(RouteName.PLAYLIST_BY_ID)}
							element={<ManagePlaylistScreen />}
						/>
					</Route>
					<Route
						path="*"
						element={
							<ErrorScreen
								resetHref={routerAdapter.generateRoute({
									name: RouteName.HOME,
								})}
							/>
						}
					/>
				</Routes>
			</Suspense>
		</RouterContext.Provider>
	);
}
