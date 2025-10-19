import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, useLocation, useNavigate } from "react-router";
import { SpotifyAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { MockErrorLoggerAdapter } from "@/features/errors/infra";
import { ErrorsProvider } from "@/features/errors/ui";
import { ReactHotToastNotificationAdapter } from "@/features/notifications/infra";
import { RepositoriesProvider } from "@/features/repositories/ui";
import { RouterAdapter } from "@/features/router/infra";
import { RouterProvider } from "@/features/router/ui";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider() {
	return (
		<BrowserRouter>
			<AdaptersProviderDI />
			<Toaster position="bottom-right" />
		</BrowserRouter>
	);
}

function AdaptersProviderDI() {
	const navigate = useNavigate();
	const location = useLocation();

	const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
	const routerAdapter = useMemo(
		() => new RouterAdapter(navigate, location),
		[location, navigate],
	);
	const authAdapter = useMemo(
		() => new SpotifyAuthAdapter(storageAdapter, routerAdapter),
		[routerAdapter, storageAdapter],
	);
	const errorLoggerAdapter = useMemo(() => new MockErrorLoggerAdapter(), []);
	const reactHotToastNotificationAdapter = useMemo(
		() => new ReactHotToastNotificationAdapter(),
		[],
	);

	const allAdapters: IAdapters = useMemo(
		() => ({
			authAdapter: authAdapter,
			errorLoggerAdapter: errorLoggerAdapter,
			notificationsAdapter: reactHotToastNotificationAdapter,
			routerAdapter: routerAdapter,
			storageAdapter: storageAdapter,
		}),
		[
			authAdapter,
			errorLoggerAdapter,
			reactHotToastNotificationAdapter,
			routerAdapter,
			storageAdapter,
		],
	);

	return (
		<AdaptersContext.Provider value={allAdapters}>
			<ErrorsProvider>
				<AuthProvider>
					<RepositoriesProvider>
						<RouterProvider />
					</RepositoriesProvider>
				</AuthProvider>
			</ErrorsProvider>
		</AdaptersContext.Provider>
	);
}
