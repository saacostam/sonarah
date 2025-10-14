import { useMemo } from "react";
import { useAdapters } from "@/features/adapters/app";
import { RouteName } from "@/features/router/domain";

export function useHomeScreen() {
	const { routerAdapter } = useAdapters();

	const ctaHref = routerAdapter.generateRoute({ name: RouteName.DASHBOARD });

	return useMemo(() => ({ ctaHref }), [ctaHref]);
}
