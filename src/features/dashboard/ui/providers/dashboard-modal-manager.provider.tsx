import type { PropsWithChildren } from "react";
import { DashboardModalManagerContext } from "../../app";
import { useDashboardModalManagerImpl } from "../../infra";

export function DashboardModalManagerProvider({ children }: PropsWithChildren) {
	return (
		<DashboardModalManagerContext.Provider
			value={useDashboardModalManagerImpl()}
		>
			{children}
		</DashboardModalManagerContext.Provider>
	);
}
