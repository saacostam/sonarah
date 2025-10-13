import type { PropsWithChildren } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouterContext } from "../../app";

export function RouterProvider({ children }: PropsWithChildren) {
	const { routerAdapter } = useAdapters();

	return (
		<RouterContext.Provider value={routerAdapter}>
			{children}
		</RouterContext.Provider>
	);
}
