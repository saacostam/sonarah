import { useMemo, useState } from "react";
import type {
	IWebPlayerState,
	IWebPlayerStatus,
} from "../domain/web-player.entity";
import { useQueryInitWebPlayer } from "./use-query-init-web-player";

export function useWebPlayer(): IWebPlayerStatus {
	const [state, setState] = useState<IWebPlayerState | null>(null);

	const queryWebPlayer = useQueryInitWebPlayer({
		setStateCb: setState,
	});

	return useMemo(
		(): IWebPlayerStatus =>
			queryWebPlayer.isSuccess
				? state && !!state.playback.paused
					? {
							type: "ready:paused",
							deviceId: queryWebPlayer.data.deviceId,
							state: state,
						}
					: state && !state.playback.paused
						? {
								type: "ready:playing",
								deviceId: queryWebPlayer.data.deviceId,
								state: state,
							}
						: {
								type: "ready:unavailable",
								deviceId: queryWebPlayer.data.deviceId,
							}
				: queryWebPlayer.isError
					? { type: "error" }
					: { type: "loading" },
		[state, queryWebPlayer],
	);
}
