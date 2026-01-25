import { useMemo, useState } from "react";
import type { IManagePlaylistModalManager } from "../domain";

export function useManagePlaylistModalManagerImpl(): IManagePlaylistModalManager {
	const [status, setStatus] = useState<IManagePlaylistModalManager["status"]>({
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
