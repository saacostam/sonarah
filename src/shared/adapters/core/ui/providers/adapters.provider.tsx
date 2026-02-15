import { type PropsWithChildren, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter } from "react-router";

import { useMockAnalyticsProvider } from "@/shared/adapters/analytics/infra";
import { SpotifyAuthAdapter } from "@/shared/adapters/auth/infra";
import { IConfigurationAdapterStringKey } from "@/shared/adapters/configuration/domain";
import { useConfigurationAdapter } from "@/shared/adapters/configuration/infra";
import { MockErrorLoggerAdapter } from "@/shared/adapters/errors/infra";
import { useIntersectionObserverAdapter } from "@/shared/adapters/intersection-observer/infra";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { NavigationProvider } from "@/shared/adapters/navigation/ui";
import { ReactHotToastNotificationAdapter } from "@/shared/adapters/notifications/infra";
import { useReactRouterAdapter } from "@/shared/adapters/router/infra";
import { LocalStorageAdapter } from "@/shared/adapters/storage/infra";
import { useThemeAdapterImpl } from "@/shared/adapters/theme/infra";
import { useSpotifyWebPlayerAdapter } from "@/shared/adapters/web-player/infra";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider({ children }: PropsWithChildren) {
	return (
		<HashRouter>
			<AdaptersProviderDI>{children}</AdaptersProviderDI>
			<Toaster position="bottom-right" />
		</HashRouter>
	);
}

function AdaptersProviderDI({ children }: PropsWithChildren) {
	const configurationAdapter = useConfigurationAdapter();

	const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
	const routerAdapter = useReactRouterAdapter({
		baseUrl: configurationAdapter.getString(
			IConfigurationAdapterStringKey.BASE_URL,
		),
	});

	const analyticsAdapter = useMockAnalyticsProvider();
	const navigationAdapter = useMemo(() => new NavigationAdapter(), []);
	const authAdapter = useMemo(
		() => new SpotifyAuthAdapter(storageAdapter, routerAdapter),
		[routerAdapter, storageAdapter],
	);
	const errorLoggerAdapter = useMemo(() => new MockErrorLoggerAdapter(), []);
	const intersectionObserverAdapter = useIntersectionObserverAdapter();
	const reactHotToastNotificationAdapter = useMemo(
		() => new ReactHotToastNotificationAdapter(),
		[],
	);
	const themeAdapter = useThemeAdapterImpl({
		storage: storageAdapter,
	});

	const session = authAdapter.getToken();
	const webPlayerAdapter = useSpotifyWebPlayerAdapter({
		token: session.type === "authenticated" ? session.token : "",
		enabled: session.type === "authenticated" && !!session.token,
	});

	useEffect(() => {
		console.log(
			"[AdaptersProviderDI]",
			configurationAdapter.getString(IConfigurationAdapterStringKey.BASE_URL),
		);
	}, [configurationAdapter]);

	const allAdapters: IAdapters = useMemo(
		() => ({
			analyticsAdapter: analyticsAdapter,
			authAdapter: authAdapter,
			configurationAdapter: configurationAdapter,
			errorLoggerAdapter: errorLoggerAdapter,
			intersectionObserverAdapter: intersectionObserverAdapter,
			notificationsAdapter: reactHotToastNotificationAdapter,
			routerAdapter: routerAdapter,
			navigationAdapter,
			storageAdapter: storageAdapter,
			themeAdapter: themeAdapter,
			webPlayerAdapter: webPlayerAdapter,
		}),
		[
			analyticsAdapter,
			authAdapter,
			configurationAdapter,
			errorLoggerAdapter,
			intersectionObserverAdapter,
			reactHotToastNotificationAdapter,
			routerAdapter,
			navigationAdapter,
			storageAdapter,
			themeAdapter,
			webPlayerAdapter,
		],
	);

	return (
		<AdaptersContext.Provider value={allAdapters}>
			<NavigationProvider>{children}</NavigationProvider>
		</AdaptersContext.Provider>
	);
}
