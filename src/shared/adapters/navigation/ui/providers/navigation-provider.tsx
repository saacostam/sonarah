import { lazy, type PropsWithChildren, Suspense } from "react";
import { Route, Routes } from "react-router";
import { HomeScreen } from "@/features/home/ui";
import { useAdapters } from "@/shared/adapters/core/app";
import { ErrorScreen } from "@/shared/adapters/errors/ui";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { AppLayout } from "@/shared/layout/ui";
import { LazyLoadedSkeleton } from "../components";

// Lazy imports
const ManagePlaylistScreen = lazy(() =>
	import("@/shared/screens/manage-playlist-screen").then((m) => ({
		default: m.ManagePlaylistScreen,
	})),
);
const MatchPlaylistScreen = lazy(() =>
	import("@/shared/screens/match-playlist-screen").then((m) => ({
		default: m.MatchPlaylistScreen,
	})),
);
const DashboardScreen = lazy(() =>
	import("@/features/dashboard/ui/screens/dashboard-screen").then((m) => ({
		default: m.DashboardScreen,
	})),
);

export function NavigationProvider({ children }: PropsWithChildren) {
	const { navigationAdapter } = useAdapters();

	return (
		<Suspense fallback={<LazyLoadedSkeleton style={{ height: "100vh" }} />}>
			<Routes>
				<Route element={<AppLayout>{children}</AppLayout>}>
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
