import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import { useAdapters } from "@/features/adapters/app";
import { AppLayout } from "@/features/app-shell/ui";
import { ErrorScreen } from "@/features/errors/ui";
import { HomeScreen } from "@/features/home/ui";
import { RouteName } from "@/features/routes/domain";
import { LazyLoadingRouteSkeleton } from "../components";

// Lazy imports
const ManagePlaylistScreen = lazy(() =>
	import("@/features/playlists/ui/screens/manage-playlist-screen").then(
		(m) => ({ default: m.ManagePlaylistScreen }),
	),
);
const MatchPlaylistScreen = lazy(() =>
	import("@/features/playlists/ui/screens/match-playlist-screen").then((m) => ({
		default: m.MatchPlaylistScreen,
	})),
);
const DashboardScreen = lazy(() =>
	import("@/features/dashboard/ui/screens/dashboard-screen").then((m) => ({
		default: m.DashboardScreen,
	})),
);

export function RoutesProvider() {
	const { routesAdapter } = useAdapters();

	return (
		<Suspense fallback={<LazyLoadingRouteSkeleton />}>
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
						path={routesAdapter.defineRoute(RouteName.DASHBOARD)}
						element={<DashboardScreen />}
					/>
					<Route
						path={routesAdapter.defineRoute(RouteName.PLAYLIST_BY_ID)}
						element={<ManagePlaylistScreen />}
					/>
					<Route
						path={routesAdapter.defineRoute(RouteName.MATCH_PLAYLIST_BY_ID)}
						element={<MatchPlaylistScreen />}
					/>
				</Route>
				<Route
					path="*"
					element={
						<ErrorScreen
							resetHref={routesAdapter.generateRoute({
								name: RouteName.HOME,
							})}
						/>
					}
				/>
			</Routes>
		</Suspense>
	);
}
