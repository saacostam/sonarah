import { useMemo, useState } from "react";
import type { IMatchPlaylistModalManager } from "../../domain";

export function useMatchPlaylistModalManagerImpl(): IMatchPlaylistModalManager {
	const [status, setStatus] = useState<IMatchPlaylistModalManager["status"]>({
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
