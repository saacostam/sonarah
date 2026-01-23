import { useCallback, useMemo } from "react";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import type { IWebPlayerRepository } from "../domain";

export interface UseSpotifyWebPlayerRepositoryArgs {
	clientAdapter: IClientAdapter;
}

export function useSpotifyWebPlayerRepository({
	clientAdapter,
}: UseSpotifyWebPlayerRepositoryArgs): IWebPlayerRepository {
	const getPlaybackState: IWebPlayerRepository["getPlaybackState"] =
		useCallback(async () => {
			const resp = await clientAdapter.get<{
				device: {
					id: string;
				};
			}>("/v1/me/player");

			return {
				device: {
					id: resp.device.id,
				},
			};
		}, [clientAdapter]);

	const transferPlayback: IWebPlayerRepository["transferPlayback"] =
		useCallback(
			({ deviceId }) => {
				return clientAdapter.put("/v1/me/player", {
					device_ids: [deviceId],
				});
			},
			[clientAdapter],
		);

	const seekToPosition: IWebPlayerRepository["seekToPosition"] = useCallback(
		({ deviceId, positionMs }) =>
			clientAdapter.put(
				`/v1/me/player/seek?position_ms=${Math.floor(positionMs)}`,
				{
					device_id: deviceId,
				},
			),
		[clientAdapter],
	);

	const playTrackOfPlaylist: IWebPlayerRepository["playTrackOfPlaylist"] =
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

	const startPlayback: IWebPlayerRepository["startPlayback"] = useCallback(
		() =>
			clientAdapter.put<void>("/v1/me/player/play", undefined, {
				responseType: "string",
			}),
		[clientAdapter],
	);

	const pausePlayback: IWebPlayerRepository["pausePlayback"] = useCallback(
		() =>
			clientAdapter.put<void>("/v1/me/player/pause", undefined, {
				responseType: "string",
			}),
		[clientAdapter],
	);

	return useMemo(
		() => ({
			getPlaybackState,
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		}),
		[
			getPlaybackState,
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		],
	);
}
