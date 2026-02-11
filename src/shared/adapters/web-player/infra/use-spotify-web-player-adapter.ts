import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import type { IWebPlayerAdapter, IWebPlayerState } from "../domain";

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
		resume(): Promise<void>;
		pause(): Promise<void>;
		seek(ms: number): Promise<void>;
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

export interface UseSpotifyWebPlayerAdapterArgs {
	token: string;
	enabled: boolean;
}

export function useSpotifyWebPlayerAdapter({
	token,
	enabled,
}: UseSpotifyWebPlayerAdapterArgs): IWebPlayerAdapter {
	const [deviceId, setDeviceId] = useState<string | null>(null);
	const [webPlayerState, setWebPlayerState] = useState<IWebPlayerState | null>(
		null,
	);
	const [webPlayer, setWebPlayer] = useState<SpotifyPlayer | null>(null);

	const [scheduledCallbacks, setScheduledCallbacks] = useState<
		Array<(state: IWebPlayerState) => void>
	>([]);

	useEffect(() => {
		if (webPlayerState !== null) {
			scheduledCallbacks.forEach((cb) => {
				cb(webPlayerState);
			});
			setScheduledCallbacks((scheduledCallbacks) =>
				scheduledCallbacks.length === 0 ? scheduledCallbacks : [],
			);
		}
	}, [scheduledCallbacks, webPlayerState]);

	useEffect(() => {
		if (!enabled || !token) {
			setDeviceId(null);
			setWebPlayerState(null);
			setScheduledCallbacks([]);
		}
	}, [enabled, token]);

	const setup = useQuery({
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		queryKey: ["private-spotify-web-player-adapter-setup", token],
		queryFn: () =>
			new Promise<null>((res, rej) => {
				setDeviceId(null);
				setWebPlayerState(null);

				window.onSpotifyWebPlaybackSDKReady =
					createOnSpotifyWebPlaybackSDKReadyHandler({
						res,
						rej,
						onDeviceId: ({ deviceId }) => setDeviceId(deviceId),
						setState: setWebPlayerState,
						setWebPlayer,
						token,
					});

				const body = document.querySelector("body");
				if (!body) {
					rej(
						new DomainError(
							DomainErrorType.APP_ERROR,
							"Spotify Web Player failed to load. Please refresh the page.",
							"[init] Couldn't load web player. Missing body tag",
						),
					);
					return null;
				}

				const scriptAlreadyExists = Array.from(
					body.querySelectorAll("script"),
				).find((script) => script.src === SPOTIFY_WEB_PLAYER_SCRIPT_SRC);
				if (scriptAlreadyExists) scriptAlreadyExists.remove();

				const script = document.createElement("script");
				script.src = SPOTIFY_WEB_PLAYER_SCRIPT_SRC;

				script.onerror = (e) => {
					rej(
						new DomainError(
							DomainErrorType.APP_ERROR,
							"Spotify Web Player failed to load. Please check your connection and try again.",
							`[script.onerror] ${e}`,
						),
					);
				};

				body.append(script);
			}),
		enabled,
	});

	const on: IWebPlayerAdapter["on"] = useCallback((event, cb) => {
		switch (event) {
			case "state-changed": {
				setScheduledCallbacks((prev) => [...prev, cb]);
				break;
			}
		}
	}, []);

	return useMemo(
		() => ({
			on,
			actions: {
				pause: webPlayer?.pause,
				resume: webPlayer?.resume,
				seek: webPlayer?.seek
					? ({ positionMs }) => webPlayer.seek(positionMs)
					: undefined,
			},
			status: setup.isError
				? {
						type: "failed",
						payload: {
							error:
								setup.error instanceof DomainError
									? setup.error
									: new DomainError(
											DomainErrorType.APP_ERROR,
											"Unable to start Spotify Web Player. Please try again.",
											`[SpotifyWebPlayerAdapter]: ${setup.error}`,
										),
							retry: setup.refetch,
						},
					}
				: deviceId
					? { type: "running", payload: { state: webPlayerState, deviceId } }
					: { type: "pending" },
		}),
		[
			deviceId,
			on,
			setup.error,
			setup.isError,
			setup.refetch,
			webPlayer,
			webPlayerState,
		],
	);
}

const WEB_PLAYER_NAME = "Sonarah Web Player";

function createOnSpotifyWebPlaybackSDKReadyHandler(args: {
	res: (v: null) => void;
	rej: (e: unknown) => void;
	onDeviceId: (args: { deviceId: string }) => void;
	setState: (state: IWebPlayerState | null) => void;
	setWebPlayer: (state: SpotifyPlayer) => void;
	token: string;
}) {
	const { res, rej, onDeviceId, setState, setWebPlayer, token } = args;

	return () => {
		if (!token || typeof token !== "string") {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback cannot start because your Spotify session has expired. Please log in again.",
					"[onSpotifyWebPlaybackSDKReady] Token not found when reading from storageAdapter",
				),
			);
			return;
		}

		if (!window.Spotify) {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback cannot start because Spotify Web Player failed to load. Please refresh the page.",
					"[onSpotifyWebPlaybackSDKReady] Spotify not attached to window object",
				),
			);
			return;
		}

		const webPlayer = new window.Spotify.Player({
			name: WEB_PLAYER_NAME,
			getOAuthToken: (cb: (token: string) => void) => cb(token),
			volume: 0.5,
		});

		webPlayer.addListener("ready", ({ device_id }) => {
			onDeviceId({ deviceId: device_id });
			setWebPlayer(webPlayer);
			res(null);
		});

		webPlayer.addListener("not_ready", (data) => {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback cannot continue because Spotify Web Player is unavailable. Please try again.",
					`[onSpotifyWebPlaybackSDKReady.listener."not_ready"] - ${data}`,
				),
			);
		});

		webPlayer.addListener("player_state_changed", (state) => {
			const webPlayerState: IWebPlayerState = {
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
			};

			setState(webPlayerState);
		});

		webPlayer.on("account_error", ({ message }) => {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback is not available for your Spotify account.",
					`[onSpotifyWebPlaybackSDKReady.on."account_error"] ${message}`,
				),
			);
		});

		webPlayer.on("initialization_error", ({ message }) => {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback failed to initialize. Please refresh the page and try again.",
					`[onSpotifyWebPlaybackSDKReady.on."initialization_error"] ${message}`,
				),
			);
		});

		webPlayer.on("playback_error", ({ message }) => {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback failed and cannot continue. Please try again.",
					`[onSpotifyWebPlaybackSDKReady.on."playback_error"] ${message}`,
				),
			);
		});

		webPlayer.on("autoplay_failed", () => {
			rej(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Autoplay was blocked by your browser.",
					`[onSpotifyWebPlaybackSDKReady.on."autoplay_failed"]`,
				),
			);
		});

		webPlayer.connect();
	};
}
