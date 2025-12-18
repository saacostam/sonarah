export type IWebPlayerStatus =
	| {
			type: "error";
	  }
	| {
			type: "loading";
	  }
	| {
			type: "ready:unavailable";
			deviceId: string;
	  }
	| {
			type: "ready:paused";
			deviceId: string;
			state: IWebPlayerState;
	  }
	| {
			type: "ready:playing";
			deviceId: string;
			state: IWebPlayerState;
	  };

export interface IWebPlayerState {
	playback: {
		duration: number;
		position: number;
		paused: boolean;
	};
	track: {
		name: string;
		artists: string[];
		img?: string;
	};
}
