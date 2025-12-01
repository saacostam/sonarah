import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter, useLocation, useNavigate } from "react-router";
import { SpotifyAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { MockErrorLoggerAdapter } from "@/features/errors/infra";
import { NavigationAdapter } from "@/features/navigation/infra";
import { NavigationProvider } from "@/features/navigation/ui";
import { ReactHotToastNotificationAdapter } from "@/features/notifications/infra";
import { RouterAdapter } from "@/features/router/infra";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { useSpotifyWebPlayerAdapter } from "@/features/web-player/infra";
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
	const webPlayerAdapter = useSpotifyWebPlayerAdapter({
		notificationsAdapter: reactHotToastNotificationAdapter,
		storageAdapter,
	});

	const allAdapters: IAdapters = useMemo(
		() => ({
			authAdapter: authAdapter,
			errorLoggerAdapter: errorLoggerAdapter,
			notificationsAdapter: reactHotToastNotificationAdapter,
			routerAdapter: routerAdapter,
			navigationAdapter,
			storageAdapter: storageAdapter,
			webPlayerAdapter: webPlayerAdapter,
		}),
		[
			authAdapter,
			errorLoggerAdapter,
			reactHotToastNotificationAdapter,
			routerAdapter,
			navigationAdapter,
			storageAdapter,
			webPlayerAdapter,
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
