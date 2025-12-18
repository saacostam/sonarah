import { useCallback, useEffect, useMemo, useState } from "react";
import type { IClientAdapter } from "@/features/clients/domain";
import {
	type INotificationAdapter,
	INotificationAdapterType,
} from "@/features/notifications/domain";
import { type IStorageAdapter, StorageKeys } from "@/features/storage/domain";
import type { IWebPlayerRepository } from "../domain";

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
	notificationsAdapter,
	storageAdapter,
	clientAdapter,
}: UseSpotifyWebPlayerRepositoryArgs): IWebPlayerRepository {
	const [, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [deviceId, setDeviceId] = useState<string | null>(null);

	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [state, setState] = useState<Spotify["PlaybackState"] | null>(null);

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

	const startPlayback: IWebPlayerRepository["startPlayback"] =
		useCallback(() => {
			setState(
				(s) =>
					({
						...s,
						paused: false,
					}) as Spotify["PlaybackState"],
			);
			return clientAdapter.put("/v1/me/player/play");
		}, [clientAdapter]);

	const pausePlayback: IWebPlayerRepository["pausePlayback"] =
		useCallback(() => {
			setState(
				(s) =>
					({
						...s,
						paused: true,
					}) as Spotify["PlaybackState"],
			);
			return clientAdapter.put("/v1/me/player/pause");
		}, [clientAdapter]);

	const init = useCallback(() => {
		if (!window.onSpotifyWebPlaybackSDKReady) {
			window.onSpotifyWebPlaybackSDKReady = async () => {
				setIsLoading(false);

				const token = await storageAdapter.get(StorageKeys.TOKEN);
				if (!token || typeof token !== "string") return;
				if (!window.Spotify) return;

				const webPlayer = new window.Spotify.Player({
					name: "Sonarah Web Player",
					getOAuthToken: (cb: (token: string) => void) => cb(token),
					volume: 0.5,
				});

				webPlayer.addListener("ready", ({ device_id }) => {
					setIsReady(true);
					setDeviceId(device_id);
					void transferPlayback({ deviceId: device_id });
				});

				webPlayer.addListener("not_ready", () => {
					setIsReady(false);
				});

				webPlayer.on("autoplay_failed", () => {
					setIsReady(false);
					console.log("autoplay_failed");
				});

				webPlayer.on("initialization_error", () => {
					setIsReady(false);
					console.log("initialization_error");
				});
				webPlayer.on("account_error", () => {
					setIsReady(false);
					console.log("account_error");
				});
				webPlayer.on("playback_error", ({ message }) => {
					setIsReady(false);
					console.log("playback_error", message);
				});

				webPlayer.addListener("player_state_changed", setState);

				await webPlayer.connect();
				webPlayer.activateElement();
				setPlayer(webPlayer);
			};
		} else {
			window.onSpotifyWebPlaybackSDKReady();
		}

		const body = document.querySelector("body");
		if (!body) {
			notificationsAdapter.notify(
				INotificationAdapterType.ERROR,
				"Web Player Error",
				"Couldn't load web player. Missing body tag",
			);
			return;
		}

		const scriptAlreadyExists = Array.from(
			body.querySelectorAll("script"),
		).some((script) => script.src === SPOTIFY_WEB_PLAYER_SCRIPT_SRC);

		if (scriptAlreadyExists) return;

		const script = document.createElement("script");
		script.src = SPOTIFY_WEB_PLAYER_SCRIPT_SRC;
		setIsLoading(true);

		script.onload = () => setIsLoading(false);
		script.onerror = () => setIsLoading(false);

		body.append(script);
	}, [notificationsAdapter, storageAdapter, transferPlayback]);

	useEffect(() => {
		init();
	}, [init]);

	return useMemo(
		() => ({
			status: isLoading
				? {
						type: "loading",
					}
				: isReady && deviceId
					? {
							type: "ready",
							deviceId,
						}
					: {
							type: "undefined",
						},
			init,
			pausePlayback,
			playback: state ? (state.paused ? "paused" : "playing") : "unavailable",
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			state: state
				? {
						duration: state.duration,
						position: state.position,
					}
				: null,
			transferPlayback,
			track: state?.track_window.current_track
				? {
						name: state.track_window.current_track.name,
						img: state.track_window.current_track.album.images.at(0)?.url,
						artists: state.track_window.current_track.artists.map(
							(artist) => artist.name,
						),
					}
				: null,
		}),
		[
			deviceId,
			init,
			isLoading,
			isReady,
			pausePlayback,
			playTrackOfPlaylist,
			seekToPosition,
			startPlayback,
			state,
			transferPlayback,
		],
	);
}
