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
const WEB_PLAYER_NAME = "Sonarah Web Player";

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
			webPlayer?.disconnect();
		}
	}, [enabled, token, webPlayer]);

	useEffect(() => {
		return () => {
			webPlayer?.disconnect();
		};
	}, [webPlayer]);

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
							"[init] Missing body tag",
						),
					);
					return;
				}

				const existing = Array.from(body.querySelectorAll("script")).find(
					(script) => script.src === SPOTIFY_WEB_PLAYER_SCRIPT_SRC,
				);
				if (existing) existing.remove();

				const script = document.createElement("script");
				script.src = SPOTIFY_WEB_PLAYER_SCRIPT_SRC;

				script.onerror = (e) => {
					rej(
						new DomainError(
							DomainErrorType.APP_ERROR,
							"Spotify Web Player failed to load. Please check your connection.",
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
											"Unable to start Spotify Web Player.",
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
		let settled = false;

		const safeResolve = (v: null) => {
			if (settled) return;
			settled = true;
			res(v);
		};

		const safeReject = (error: DomainError) => {
			if (settled) return;
			settled = true;
			rej(error);
		};

		if (!token) {
			safeReject(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Your Spotify session has expired. Please log in again.",
					"[SDKReady] Missing token",
				),
			);
			return;
		}

		if (!window.Spotify) {
			safeReject(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Spotify Web Player failed to initialize. Please refresh the page.",
					"[SDKReady] Spotify not found on window",
				),
			);
			return;
		}

		const webPlayer = new window.Spotify.Player({
			name: WEB_PLAYER_NAME,
			getOAuthToken: (cb) => cb(token),
			volume: 0.5,
		});

		webPlayer.addListener("ready", ({ device_id }) => {
			onDeviceId({ deviceId: device_id });
			setWebPlayer(webPlayer);
			safeResolve(null);
		});

		webPlayer.addListener("player_state_changed", (state) => {
			setState({
				playback: {
					duration: state.duration,
					position: state.position,
					paused: state.paused,
				},
				track: {
					artists: state.track_window.current_track.artists.map((a) => a.name),
					name: state.track_window.current_track.name,
					img: state.track_window.current_track.album.images.at(0)?.url,
				},
			});
		});

		webPlayer.on("account_error", ({ message }) => {
			safeReject(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Playback is not available for this Spotify account.",
					`[account_error] ${message}`,
				),
			);
		});

		webPlayer.on("initialization_error", ({ message }) => {
			safeReject(
				new DomainError(
					DomainErrorType.APP_ERROR,
					"Spotify failed to initialize.",
					`[initialization_error] ${message}`,
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

		webPlayer.connect().then((success) => {
			if (!success) {
				safeReject(
					new DomainError(
						DomainErrorType.APP_ERROR,
						"Spotify connection failed.",
						"[connect] returned false",
					),
				);
			}
		});
	};
}
