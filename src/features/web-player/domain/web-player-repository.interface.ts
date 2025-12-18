export interface IWebPlayerRepository {
	status:
		| {
				type: "undefined";
		  }
		| {
				type: "loading";
		  }
		| {
				type: "ready";
				deviceId: string;
		  };
	init(): void;
	playback: "unavailable" | "paused" | "playing";
	state: {
		duration: number;
		position: number;
	} | null;
	track: {
		name: string;
		artists: string[];
		img?: string;
	} | null;
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
