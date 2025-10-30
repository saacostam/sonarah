import type { PropsWithChildren } from "react";
import { DashboardModalManagerContext } from "./modal-manager-context";
import { useDashboardModalManagerImpl } from "./use-dashboard-modal-manager";

export function DashboardModalManagerProvider({ children }: PropsWithChildren) {
	return (
		<DashboardModalManagerContext.Provider
			value={useDashboardModalManagerImpl()}
		>
			{children}
		</DashboardModalManagerContext.Provider>
	);
}
