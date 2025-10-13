import { HashRouter, Outlet, Route, Routes } from "react-router";
import { useAdapters } from "@/features/adapters/app";
import { AppLayout } from "@/features/app-shell/ui";
import { RouterContext } from "../../app";
import { RouteName } from "../../domain";

export function RouterProvider() {
	const { routerAdapter } = useAdapters();

	return (
		<HashRouter>
			<RouterContext.Provider value={routerAdapter}>
				<Routes>
					<Route
						element={
							<AppLayout>
								<Outlet />
							</AppLayout>
						}
					>
						<Route index element="Home" />
						<Route
							path={routerAdapter.generateRoute({ name: RouteName.LOGIN })}
							element="Login"
						/>
					</Route>
				</Routes>
			</RouterContext.Provider>
		</HashRouter>
	);
}
