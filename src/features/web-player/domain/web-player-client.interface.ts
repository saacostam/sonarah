export interface IWebPlayerClient {
	playTrackOfPlaylist: (
		args: IWebPlayerClientPayload["PlayTrackOfPlaylistIn"],
	) => Promise<void>;
	seekToPosition: (
		args: IWebPlayerClientPayload["SeekToPositionIn"],
	) => Promise<void>;
	transferPlayback: (
		args: IWebPlayerClientPayload["TranferPlaybackIn"],
	) => Promise<void>;
	startPlayback(): Promise<void>;
	pausePlayback(): Promise<void>;
}

export interface IWebPlayerClientPayload {
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
