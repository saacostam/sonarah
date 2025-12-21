import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter, useLocation, useNavigate } from "react-router";
import { SpotifyAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { NavigationAdapter } from "@/features/navigation/infra";
import { NavigationProvider } from "@/features/navigation/ui";
import { MockErrorLoggerAdapter } from "@/shared/adapters/errors/infra";
import { ReactHotToastNotificationAdapter } from "@/shared/adapters/notifications/infra";
import { RouterAdapter } from "@/shared/adapters/router/infra";
import { LocalStorageAdapter } from "@/shared/adapters/storage/infra";
import { RepositoriesProvider } from "@/shared/repositories/ui";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider() {
	return (
		<HashRouter>
			<AdaptersProviderDI />
			<Toaster position="bottom-right" />
		</HashRouter>
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
	const navigationAdapter = useMemo(() => new NavigationAdapter(), []);
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
			navigationAdapter,
			storageAdapter: storageAdapter,
		}),
		[
			authAdapter,
			errorLoggerAdapter,
			reactHotToastNotificationAdapter,
			routerAdapter,
			navigationAdapter,
			storageAdapter,
		],
	);

	return (
		<AdaptersContext.Provider value={allAdapters}>
			<AuthProvider>
				<RepositoriesProvider>
					<NavigationProvider />
				</RepositoriesProvider>
			</AuthProvider>
		</AdaptersContext.Provider>
	);
}
