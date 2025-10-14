import { Outlet, Route, Routes } from "react-router";
import { useAdapters } from "@/features/adapters/app";
import { AppLayout } from "@/features/app-shell/ui";
import { ErrorScreen } from "@/features/errors/ui";
import { HomeScreen } from "@/features/home/ui";
import { RouterContext } from "../../app";
import { RouteName } from "../../domain";

export function RouterProvider() {
	const { routerAdapter } = useAdapters();

	return (
		<RouterContext.Provider value={routerAdapter}>
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
						path={routerAdapter.generateRoute({ name: RouteName.LOGIN })}
						element="Login"
					/>
				</Route>
				<Route
					path="*"
					element={
						<ErrorScreen
							resetHref={routerAdapter.generateRoute({ name: RouteName.HOME })}
						/>
					}
				/>
			</Routes>
		</RouterContext.Provider>
	);
}
