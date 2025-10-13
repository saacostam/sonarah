import { useMemo } from "react";
import { HashRouter, useLocation, useNavigate } from "react-router";
import { StorageAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { RouterAdapter } from "@/features/router/infra";
import { RouterProvider } from "@/features/router/ui";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider() {
	return (
		<HashRouter>
			<AdaptersProviderDI />
		</HashRouter>
	);
}

function AdaptersProviderDI() {
	const navigate = useNavigate();
	const location = useLocation();

	const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
	const authAdapter = useMemo(
		() => new StorageAuthAdapter(storageAdapter),
		[storageAdapter],
	);
	const routerAdapter = useMemo(
		() => new RouterAdapter(navigate, location),
		[location, navigate],
	);

	const allAdapters: IAdapters = useMemo(
		() => ({
			authAdapter: authAdapter,
			routerAdapter: routerAdapter,
			storageAdapter: storageAdapter,
		}),
		[authAdapter, routerAdapter, storageAdapter],
	);

	return (
		<AdaptersContext.Provider value={allAdapters}>
			<AuthProvider>
				<RouterProvider />
			</AuthProvider>
		</AdaptersContext.Provider>
	);
}
