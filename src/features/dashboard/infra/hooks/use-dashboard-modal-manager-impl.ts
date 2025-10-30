import { useMemo, useState } from "react";
import type { IDashboardModalManager } from "../../domain";

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
