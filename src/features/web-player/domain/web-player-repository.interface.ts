export interface IWebPlayerRepository {
	getPlaybackState(): Promise<
		IWebPlayerRepositoryPayload["GetPlaybackStateResponse"]
	>;
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
	GetPlaybackStateResponse: {
		device: {
			id: string;
		};
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
