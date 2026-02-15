import { useCallback, useMemo } from "react";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import type { IWebPlayerClient } from "../domain";

export interface UseSpotifyWebPlayerClientArgs {
	clientAdapter: IClientAdapter;
}

export function useSpotifyWebPlayerClient({
	clientAdapter,
}: UseSpotifyWebPlayerClientArgs): IWebPlayerClient {
	const transferPlayback: IWebPlayerClient["transferPlayback"] = useCallback(
		({ deviceId }) => {
			return clientAdapter.put("/v1/me/player", {
				device_ids: [deviceId],
			});
		},
		[clientAdapter],
	);

	const seekToPosition: IWebPlayerClient["seekToPosition"] = useCallback(
		({ deviceId, positionMs }) =>
			clientAdapter.put(
				`/v1/me/player/seek?position_ms=${Math.floor(positionMs)}`,
				{
					device_id: deviceId,
				},
			),
		[clientAdapter],
	);

	const playTrackOfPlaylist: IWebPlayerClient["playTrackOfPlaylist"] =
		useCallback(
			({ playlist, positionMs }) => {
				return clientAdapter.put<void>(
					"/v1/me/player/play",
					{
						context_uri: playlist.uri,
						offset: {
							position: playlist.position,
						},
						position_ms: positionMs ?? 60 * 1000,
					},
					{
						responseType: "string",
					},
				);
			},
			[clientAdapter],
		);

	const startPlayback: IWebPlayerClient["startPlayback"] = useCallback(
		() =>
			clientAdapter.put<void>("/v1/me/player/play", undefined, {
				responseType: "string",
			}),
		[clientAdapter],
	);

	const pausePlayback: IWebPlayerClient["pausePlayback"] = useCallback(
		() =>
			clientAdapter.put<void>("/v1/me/player/pause", undefined, {
				responseType: "string",
			}),
		[clientAdapter],
	);

	return useMemo(
		() => ({
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		}),
		[
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		],
	);
}
