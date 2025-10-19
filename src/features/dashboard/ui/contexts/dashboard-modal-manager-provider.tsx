import type { PropsWithChildren } from "react";
import { DashboardModalManagerContext } from "./modal-manager-context";
import { usePrivateDashboardModalManager } from "./use-dashboard-modal-manager";

export function DashboardModalManagerProvider({ children }: PropsWithChildren) {
	return (
		<DashboardModalManagerContext.Provider
			value={usePrivateDashboardModalManager()}
		>
			{children}
		</DashboardModalManagerContext.Provider>
	);
}
