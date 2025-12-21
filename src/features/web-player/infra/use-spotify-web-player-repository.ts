import { useCallback, useMemo } from "react";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import type { INotificationAdapter } from "@/shared/adapters/notifications/domain";
import {
	type IStorageAdapter,
	StorageKeys,
} from "@/shared/adapters/storage/domain";
import type {
	IWebPlayerRepository,
	IWebPlayerRepositoryPayload,
	IWebPlayerState,
} from "../domain";

declare global {
	interface Window {
		onSpotifyWebPlaybackSDKReady?: () => void;
		Spotify?: Spotify;
	}

	interface Spotify {
		Player: {
			new (options: {
				name: string;
				getOAuthToken: (cb: (token: string) => void) => void;
				volume?: number;
			}): SpotifyPlayer;
		};
		PlaybackState: {
			duration: number;
			position: number;
			paused: boolean;
			track_window: {
				current_track: {
					name: string;
					artists: {
						name: string;
					}[];
					album: {
						images: {
							url: string;
						}[];
					};
				};
			};
		};
	}

	interface SpotifyPlayer {
		connect(): Promise<boolean>;
		disconnect(): void;
		resume(): void;
		pause(): void;
		activateElement(): void;
		addListener(
			event: "ready",
			cb: (data: { device_id: string }) => void,
		): boolean;
		addListener(
			event: "not_ready",
			cb: (data: { device_id: string }) => void,
		): boolean;
		addListener(
			event: "player_state_changed",
			cb: (state: Spotify["PlaybackState"]) => void,
		): boolean;
		removeListener(
			event: "ready" | "not_ready" | "player_state_changed",
			cb?: () => void,
		): boolean;
		on(event: "autoplay_failed", cb: () => void): void;
		on(
			event: "initialization_error" | "account_error" | "playback_error",
			cb: (data: { message: string }) => void,
		): void;
	}
}

const SPOTIFY_WEB_PLAYER_SCRIPT_SRC = "https://sdk.scdn.co/spotify-player.js";

export interface UseSpotifyWebPlayerRepositoryArgs {
	notificationsAdapter: INotificationAdapter;
	storageAdapter: IStorageAdapter;
	clientAdapter: IClientAdapter;
}

export function useSpotifyWebPlayerRepository({
	storageAdapter,
	clientAdapter,
}: UseSpotifyWebPlayerRepositoryArgs): IWebPlayerRepository {
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
				return clientAdapter.put("/v1/me/player/play", {
					context_uri: playlist.uri,
					offset: {
						position: playlist.position,
					},
					position_ms: positionMs ?? 60 * 1000,
				});
			},
			[clientAdapter],
		);

	const startPlayback: IWebPlayerRepository["startPlayback"] = useCallback(
		() => clientAdapter.put("/v1/me/player/play"),
		[clientAdapter],
	);

	const pausePlayback: IWebPlayerRepository["pausePlayback"] = useCallback(
		() => clientAdapter.put("/v1/me/player/pause"),
		[clientAdapter],
	);

	const init: IWebPlayerRepository["init"] = useCallback(
		(args) =>
			new Promise<IWebPlayerRepositoryPayload["InitOut"]>((res, rej) => {
				window.onSpotifyWebPlaybackSDKReady =
					window.onSpotifyWebPlaybackSDKReady ??
					createOnSpotifyWebPlaybackSDKReadyHandler({
						res,
						storageAdapter,
						setState: args.setStateCb,
						onSuccess: ({ deviceId }) => transferPlayback({ deviceId }),
					});

				const body = document.querySelector("body");
				if (!body) {
					throw new DomainError(
						DomainErrorType.APP_ERROR,
						"Couldn't load web player",
						"[init] Couldn't load web player. Missing body tag",
					);
				}

				const scriptAlreadyExists = Array.from(
					body.querySelectorAll("script"),
				).find((script) => script.src === SPOTIFY_WEB_PLAYER_SCRIPT_SRC);
				if (scriptAlreadyExists) scriptAlreadyExists.remove();

				const script = document.createElement("script");
				script.src = SPOTIFY_WEB_PLAYER_SCRIPT_SRC;

				script.onerror = rej;

				body.append(script);
			}),
		[storageAdapter, transferPlayback],
	);

	return useMemo(
		() => ({
			init,
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		}),
		[
			init,
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			transferPlayback,
		],
	);
}

const WEB_PLAYER_NAME = "Sonarah Web Player";

function createOnSpotifyWebPlaybackSDKReadyHandler(args: {
	onSuccess: (args: IWebPlayerRepositoryPayload["InitOut"]) => void;
	res: (args: IWebPlayerRepositoryPayload["InitOut"]) => void;
	setState: (state: IWebPlayerState) => void;
	storageAdapter: IStorageAdapter;
}) {
	const { onSuccess, res, setState, storageAdapter } = args;

	return () => {
		return storageAdapter.get(StorageKeys.TOKEN).then((token) => {
			if (!token || typeof token !== "string") {
				throw new DomainError(
					DomainErrorType.APP_ERROR,
					"Token not found",
					"[onSpotifyWebPlaybackSDKReady] Token not found when reading from storageAdapter",
				);
			}
			if (!window.Spotify) {
				throw new DomainError(
					DomainErrorType.APP_ERROR,
					"Spotify could not be added",
					"[onSpotifyWebPlaybackSDKReady] Spotify not attached to window object",
				);
			}

			const webPlayer = new window.Spotify.Player({
				name: WEB_PLAYER_NAME,
				getOAuthToken: (cb: (token: string) => void) => cb(token),
				volume: 0.5,
			});

			webPlayer.addListener("ready", ({ device_id }) => {
				const payload = {
					deviceId: device_id,
					player: webPlayer,
				};

				onSuccess(payload);
				res(payload);
			});

			webPlayer.addListener("not_ready", () => {});

			webPlayer.addListener("player_state_changed", (state) => {
				setState({
					playback: {
						duration: state.duration,
						position: state.position,
						paused: state.paused,
					},
					track: {
						artists: state.track_window.current_track.artists.map(
							({ name }) => name,
						),
						name: state.track_window.current_track.name,
						img: state.track_window.current_track.album.images.at(0)?.url,
					},
				});
			});

			webPlayer.connect();
		});
	};
}

// webPlayer.on("autoplay_failed", () => {
// 	console.log("autoplay_failed");
// });

// webPlayer.on("initialization_error", () => {
// 	console.log("initialization_error");
// });
// webPlayer.on("account_error", () => {
// 	console.log("account_error");
// });
// webPlayer.on("playback_error", ({ message }) => {
// 	console.log("playback_error", message);
// });

// return async () => {
// 	const token = await storageAdapter.get(StorageKeys.TOKEN);
// 	if (!token || typeof token !== "string") {
// 		throw new DomainError(DomainErrorType.APP_ERROR, "Token not found", "[onSpotifyWebPlaybackSDKReady] Token not found when reading from storageAdapter");
// 	}
// 	if (!window.Spotify) {
// 		throw new DomainError(DomainErrorType.APP_ERROR, "Spotify could not be added", "[onSpotifyWebPlaybackSDKReady] Spotify not attached to window object");
// 	};

// 	const webPlayer = new window.Spotify.Player({
// 		name: WEB_PLAYER_NAME,
// 		getOAuthToken: (cb: (token: string) => void) => cb(token),
// 		volume: 0.5,
// 	});

// 	webPlayer.addListener("ready", ({ device_id }) => {
// 		setDeviceId(device_id);
// 		void transferPlayback({ deviceId: device_id });
// 	});

// 	webPlayer.addListener("not_ready", () => {
// 	});

// 	webPlayer.on("autoplay_failed", () => {
// 		console.log("autoplay_failed");
// 	});

// 	webPlayer.on("initialization_error", () => {
// 		console.log("initialization_error");
// 	});
// 	webPlayer.on("account_error", () => {
// 		console.log("account_error");
// 	});
// 	webPlayer.on("playback_error", ({ message }) => {
// 		console.log("playback_error", message);
// 	});

// 	webPlayer.addListener("player_state_changed", setState);

// 	await webPlayer.connect();
// 	webPlayer.activateElement();
// 	setPlayer(webPlayer);
// };
