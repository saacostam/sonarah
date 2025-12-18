import type { IWebPlayerState } from "./web-player.entity";

export interface IWebPlayerRepository {
	init(
		args: IWebPlayerRepositoryPayload["InitIn"],
	): Promise<IWebPlayerRepositoryPayload["InitOut"]>;
	playTrackOfPlaylist: (
		args: IWebPlayerRepositoryPayload["PlayTrackOfPlaylistIn"],
	) => Promise<void>;
	seekToPosition: (
		args: IWebPlayerRepositoryPayload["SeekToPositionIn"],
	) => Promise<void>;
	transferPlayback: (
		args: IWebPlayerRepositoryPayload["TranferPlaybackIn"],
	) => Promise<void>;
	startPlayback(): Promise<void>;
	pausePlayback(): Promise<void>;
}

export interface IWebPlayerRepositoryPayload {
	InitIn: {
		setStateCb: (state: IWebPlayerState) => void;
	};
	InitOut: {
		player: SpotifyPlayer;
		deviceId: string;
	};
	PlayTrackOfPlaylistIn: {
		playlist: {
			uri: string;
			position: number;
		};
		positionMs?: number;
	};
	SeekToPositionIn: {
		deviceId: string;
		positionMs: number;
	};
	TranferPlaybackIn: {
		deviceId: string;
	};
}
