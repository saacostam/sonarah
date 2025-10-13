import { type PropsWithChildren, useMemo } from "react";
import { StorageAuthAdapter } from "@/features/auth/infra";
import { AuthProvider } from "@/features/auth/ui";
import { RouterAdapter } from "@/features/router/infra";
import { RouterProvider } from "@/features/router/ui";
import { LocalStorageAdapter } from "@/features/storage/infra";
import { AdaptersContext } from "../../app";
import type { IAdapters } from "../../domain";

export function AdaptersProvider({ children }: PropsWithChildren) {
	const storageAdapter = useMemo(() => new LocalStorageAdapter(), []);
	const authAdapter = useMemo(
		() => new StorageAuthAdapter(storageAdapter),
		[storageAdapter],
	);
	const routerAdapter = useMemo(() => new RouterAdapter(), []);

	const allAdapters: IAdapters = {
		authAdapter: authAdapter,
		routerAdapter: routerAdapter,
		storageAdapter: storageAdapter,
	};

	return (
		<AdaptersContext.Provider value={allAdapters}>
			<RouterProvider>
				<AuthProvider>{children}</AuthProvider>
			</RouterProvider>
		</AdaptersContext.Provider>
	);
}
