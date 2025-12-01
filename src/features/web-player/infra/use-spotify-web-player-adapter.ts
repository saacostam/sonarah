import { useCallback, useEffect, useMemo, useState } from "react";
import {
	type INotificationAdapter,
	INotificationAdapterType,
} from "@/features/notifications/domain";
import { type IStorageAdapter, StorageKeys } from "@/features/storage/domain";
import type { IWebPlayerAdapter } from "../domain";

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
	}

	interface SpotifyPlayer {
		connect(): Promise<boolean>;
		disconnect(): void;
		resume(): void;
		pause(): void;
		addListener(event: "ready" | "not_ready", cb: () => void): boolean;
		removeListener(event: "ready" | "not_ready", cb?: () => void): boolean;
	}
}

const SPOTIFY_WEB_PLAYER_SCRIPT_SRC = "https://sdk.scdn.co/spotify-player.js";

export interface UseSpotifyWebPlayerAdapterArgs {
	notificationsAdapter: INotificationAdapter;
	storageAdapter: IStorageAdapter;
}

export function useSpotifyWebPlayerAdapter({
	notificationsAdapter,
	storageAdapter,
}: UseSpotifyWebPlayerAdapterArgs): IWebPlayerAdapter {
	const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
	const [isReady, setIsReady] = useState(false);

	const token = useMemo(() => {
		const rawToken = storageAdapter.get(StorageKeys.TOKEN);
		return typeof rawToken === "string" ? rawToken : null;
	}, [storageAdapter]);

	const init = useCallback(() => {
		// Setup callback
		if (!window.onSpotifyWebPlaybackSDKReady) {
			window.onSpotifyWebPlaybackSDKReady = () => {
				if (!token || !window.Spotify) return;

				const webPlayer = new window.Spotify.Player({
					name: "My Web Player",
					getOAuthToken: (cb) => cb(token),
					volume: 0.5,
				});

				// Setup callbacks
				webPlayer.addListener("ready", () => setIsReady(true));
				webPlayer.addListener("not_ready", () => setIsReady(false));

				setPlayer(webPlayer);
			};
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

		// Check if script is already in body element
		const allScripts = body.querySelectorAll("script");

		let isScriptAppendedToBody = false;
		allScripts.forEach((script) => {
			isScriptAppendedToBody =
				isScriptAppendedToBody || script.src === SPOTIFY_WEB_PLAYER_SCRIPT_SRC;
		});

		if (isScriptAppendedToBody) return;

		// Append script
		const script = document.createElement("script");
		script.src = SPOTIFY_WEB_PLAYER_SCRIPT_SRC;
		body.append(script);
	}, [notificationsAdapter, token]);

	useEffect(() => {
		init();
	}, [init]);

	const play = useCallback(() => {
		if (!player) return;

		player.resume();
	}, [player]);

	const pause = useCallback(() => {
		if (!player) return;

		player.pause();
	}, [player]);

	return useMemo(
		() =>
			isReady
				? {
						isReady,
						init,
						play,
						pause,
					}
				: {
						isReady,
						init,
					},
		[init, isReady, pause, play],
	);
}
