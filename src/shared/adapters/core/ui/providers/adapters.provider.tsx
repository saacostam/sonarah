import { Theme } from "@radix-ui/themes";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter } from "react-router";

import { SpotifyAuthAdapter } from "@/shared/adapters/auth/infra";
import { AuthProvider } from "@/shared/adapters/auth/ui";
import { MockErrorLoggerAdapter } from "@/shared/adapters/errors/infra";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { NavigationProvider } from "@/shared/adapters/navigation/ui";
import { ReactHotToastNotificationAdapter } from "@/shared/adapters/notifications/infra";
import { useReactRouterAdapter } from "@/shared/adapters/router/infra";
import { LocalStorageAdapter } from "@/shared/adapters/storage/infra";
import { useThemeAdapterImpl } from "@/shared/adapters/theme/infra";
import { BackgroundWave } from "@/shared/components";
import { RepositoriesProvider } from "@/shared/repositories/ui";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider() {
	return (
		<Theme accentColor="iris" grayColor="sage" panelBackground="translucent">
			<div className="app-shell">
				<BackgroundWave className="app-shell__bg" />

				<HashRouter>
					<AdaptersProviderDI />
					<Toaster position="bottom-right" />
				</HashRouter>
			</div>
		</Theme>
	);
}

function AdaptersProviderDI() {
	const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
	const routerAdapter = useReactRouterAdapter();
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
	const themeAdapter = useThemeAdapterImpl({
		storage: storageAdapter,
	});

	const allAdapters: IAdapters = useMemo(
		() => ({
			authAdapter: authAdapter,
			errorLoggerAdapter: errorLoggerAdapter,
			notificationsAdapter: reactHotToastNotificationAdapter,
			routerAdapter: routerAdapter,
			navigationAdapter,
			storageAdapter: storageAdapter,
			themeAdapter: themeAdapter,
		}),
		[
			authAdapter,
			errorLoggerAdapter,
			reactHotToastNotificationAdapter,
			routerAdapter,
			navigationAdapter,
			storageAdapter,
			themeAdapter,
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
