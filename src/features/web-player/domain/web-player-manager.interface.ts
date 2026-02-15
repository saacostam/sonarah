import type { IWebPlayerState } from "@/shared/adapters/web-player/domain";
import type { IWebPlayerClientPayload } from "./web-player-client.interface";

type TrackedPromise<Args> = {
	onClick: (args: Args) => void;
	isPending: boolean;
};

type Mutations = {
	startPlayback: TrackedPromise<void>;
	pausePlayback: TrackedPromise<void>;
	seekToPosition: TrackedPromise<{
		positionMs: number;
	}>;
	playTrackOfPlaylist: TrackedPromise<
		IWebPlayerClientPayload["PlayTrackOfPlaylistIn"]
	>;
};

export type IWebPlayerManager =
	| {
			status: "failed" | "loading";
	  }
	| ({
			status: "playback-not-available";
			openTransferPlaybackModal: () => void;
	  } & Mutations)
	| ({
			status: "ready";
			state: IWebPlayerState;
	  } & Mutations);

export type IWebPlayerManagerModal =
	| { type: "open"; deviceId: string; onSuccess: () => void }
	| {
			type: "closed";
	  };
