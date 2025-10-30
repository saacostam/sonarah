import { useContext, useMemo, useState } from "react";
import {
	DashboardModalManagerContext,
	type IDashboardModalManager,
} from "./modal-manager-context";

export function useDashboardModalManagerImpl(): IDashboardModalManager {
	const [status, setStatus] = useState<IDashboardModalManager["status"]>({
		type: "browse",
	});

	return useMemo(
		() => ({
			status,
			setStatus,
		}),
		[status],
	);
}

export function useDashboardModalManager() {
	return useContext(DashboardModalManagerContext);
}
