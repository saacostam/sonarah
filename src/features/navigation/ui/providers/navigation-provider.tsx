import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import { HomeScreen } from "@/features/home/ui";
import { RouteName } from "@/features/navigation/domain";
import { useAdapters } from "@/shared/adapters/core/app";
import { ErrorScreen } from "@/shared/adapters/errors/ui";
import { AppLayout } from "@/shared/layout/ui";
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

export function NavigationProvider() {
	const { navigationAdapter } = useAdapters();

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
						path={navigationAdapter.defineRoute(RouteName.DASHBOARD)}
						element={<DashboardScreen />}
					/>
					<Route
						path={navigationAdapter.defineRoute(RouteName.PLAYLIST_BY_ID)}
						element={<ManagePlaylistScreen />}
					/>
					<Route
						path={navigationAdapter.defineRoute(RouteName.MATCH_PLAYLIST_BY_ID)}
						element={<MatchPlaylistScreen />}
					/>
				</Route>
				<Route
					path="*"
					element={
						<ErrorScreen
							resetHref={navigationAdapter.generateRoute({
								name: RouteName.HOME,
							})}
						/>
					}
				/>
			</Routes>
		</Suspense>
	);
}
